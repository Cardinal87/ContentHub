from rest_framework.exceptions import ValidationError
from django.contrib.auth import aauthenticate, alogin, logout
from rest_framework.response import Response
from rest_framework import status
from adrf.viewsets import ViewSet
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from asgiref.sync import sync_to_async
from .serializers import UserSerializer, NoteSerializer, PasswordSerializer
from .models import Note
import httpx
import os
from django.contrib.auth.models import User


class UsersViewSet(ViewSet):
    """
    ViewSet for users
    """

    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'create':
            return []
        return super().get_permissions()




    async def create(self, request: Request):

        """
        Adding new user
        """

        try:
            serializer = UserSerializer(data=request.data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            user = await sync_to_async(User.objects.create_user)(**serializer.validated_data)
            await alogin(request, user)
            return Response({"message": "success"}, status=status.HTTP_201_CREATED)
        except AssertionError as ex:
            return Response({"error": str(ex)}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as ex:
            return Response({"error": str(ex)}, status=ex.status_code)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['DELETE'], url_path='me')
    async def delete_me(self, request: Request):

        """
        Deletng user

        * Requires authentication
        """

        try:
            user = request.user
            await user.adelete()
            return Response({"message": "user deleted"}, status=status.HTTP_200_OK)
        except user.DoesNotExist as ex:
            return Response({"error": "user does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    @delete_me.mapping.patch
    async def update_me(self, request : Request):
        
        """
        Updating user data

        * Requires authentication
        """

        try:
            if 'new_password' in request.data:
                serializer = PasswordSerializer(data=request.data)
                await sync_to_async(serializer.is_valid)(raise_exception=True)
                data = await serializer.adata
                user = request.user
                await sync_to_async(user.set_password)(data['new_password'])
                await user.asave()
                return Response({"message": "password changed"}, status=status.HTTP_200_OK)
            else:
                serializer = UserSerializer(data=request.data, instance=request.user)
                await sync_to_async(serializer.is_valid)(raise_exception=True)
                await serializer.asave()
                return Response({"message": "username changed"}, status=status.HTTP_200_OK)
        except ValidationError as ex:
            return Response({"error": str(ex)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class AuthenticationViewSet(ViewSet):

    
    """
    ViewSet for authorization
    """

    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action != 'logout':
            return []
        return super().get_permissions()
    
    async def create(self, request: Request):
        
        """
        Authorizes users
        """

        try:
            kwargs = request.data
            user = await aauthenticate(request, username=kwargs["username"], password=kwargs["password"] )
            if user is not None: 
                await alogin(request, user)
                return Response({"message": "success"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "invalid password or username"}, status=status.HTTP_400_BAD_REQUEST)
            
        except ValidationError:    
            return Response({"error": "invalid password or username"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['DELETE'])
    async def session(self, request: Request):

        """
        Logging out users

        * Requires authentication
        """

        await sync_to_async(logout)(request)
        return Response({"message": "user loged out"}, status=status.HTTP_200_OK)
    


    @action(detail=False, methods=['GET'])
    async def status(self, request: Request):

        """
        Checking user authentication
        """

        if request.user.is_authenticated:
            return Response({"message": "authenticated", "id": request.user.id}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)



class NotesViewSet(ViewSet):

    """
    ViewSet for notes

    * Requires authentication
    """
    
    permission_classes = [IsAuthenticated]

    async def create(self, request: Request):

        """
        Creating notes
        """
        try:
            serializer = NoteSerializer(data={**request.data, "user" : request.user.id})
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            note = await serializer.asave()
            note_data = await serializer.adata
            
            url = os.getenv('AI_RAG_URL')
            async with httpx.AsyncClient(base_url=url) as client:
                response = await client.post(
                    url='/api/v1/chat/rag/storage', 
                    json={
                        'note':{
                            'text': note_data['text'],
                            'name': note_data['name'],
                            'user_id': request.user.id
                        }
                    }
                    )

                if response.status_code == 200:
                    data = response.json();
                    uuid = data['uuid']
                    note.vector_uuid = uuid
                    await note.asave()

                elif response.status_code == 400:
                    data = response.json()
                    return Response({"error": data['error']}, status=status.HTTP_400_BAD_REQUEST)
                elif response.status_code == 500:
                    data = response.json()
                    return Response({"error": data['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

            return Response({"message": "note added", "id": note.id}, status=status.HTTP_201_CREATED)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    async def destroy(self, request: Request, pk=None):
        
        """
        Deleting notes
        """
        
        
        try:
            instance = await Note.objects.aget(id=pk, user=request.user)
            await instance.adelete()
            return Response({"message": "note deleted"}, status=status.HTTP_200_OK)
        except Note.DoesNotExist as ex:
            return Response({"error": "permission denied or not found"}, status=403)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    async def list(self, request: Request):
        
        """
        Return all user notes
        """
        
        try:
            user_notes = await sync_to_async(list)(Note.objects.filter(user=request.user))
            serializer = NoteSerializer(instance=user_notes, many=True)
            return Response(await serializer.adata, status=status.HTTP_200_OK)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    async def update(self, request: Request, pk=None):
        
        """
        Updating note
        """

        try:
            instance = await Note.objects.aget(id=pk, user=request.user)
            serializer = NoteSerializer(data={**request.data, "user": request.user.id}, instance = instance)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            await serializer.asave()
            return Response({"message": "note updated"}, status=status.HTTP_200_OK)
        except Note.DoesNotExist as ex:
            return Response({"error": "permission denied or not found"}, status=403)
        except Exception as ex:
            return Response({"error": str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


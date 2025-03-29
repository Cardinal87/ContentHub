from rest_framework.exceptions import ValidationError
from django.contrib.auth import aauthenticate, alogin, logout
from rest_framework.response import Response
from adrf.viewsets import ViewSet
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from asgiref.sync import sync_to_async
from .serializers import UserSerializer, NoteSerializer
from .models import Note
from django.contrib.auth.models import User


class UsersViewSet(ViewSet):
    """
    ViewSet for users
    """

    permission_classes = [AllowAny]
    
    async def create(self, request: Request):

        """
        Adding new user
        """

        try:
            serializer = UserSerializer(data=request.data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            user = await sync_to_async(User.objects.create_user)(**serializer.validated_data)
            await alogin(request, user)
            return Response({"message": "success"}, status=200)
        except AssertionError as ex:
            return Response({"error": str(ex)}, status=400)
        except ValidationError as ex:
            return Response({"error": str(ex)}, status=ex.status_code)
        except Exception as ex:
            return Response({"error": str(ex)}, status=500)



    

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
                return Response({"message": "success"}, status=200)
            else:
                return Response({"error": "invalid password or username"}, status=400)
            
        except ValidationError:    
            return Response({"error": "invalid password or username"}, status=400)
        except Exception as ex:
            return Response({"error": str(ex)}, status=500)


    @action(detail=False, methods=['DELETE'])
    async def logout(self, request: Request):

        """
        Logging out users

        * Requires authentication
        """

        await sync_to_async(logout)(request)
        return Response({"message": "user loged out"}, status=200)
    


    @action(detail=False, methods=['GET'])
    async def check(self, request: Request):

        """
        Checking user authentication
        """

        if request.user.is_authenticated:
            return Response({"message": "authenticated", "id": request.user.id}, status=200)
        else:
            return Response({"error": "unauthorized"}, status=401)



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
            await serializer.asave()
            note = await serializer.adata
            return Response({"message": "note added", "id": note['id']}, status=200)
        except Exception as ex:
            return Response({"error": str(ex)}, status=500)

    async def destroy(self, request: Request, pk=None):
        
        """
        Deleting notes
        """
        
        
        try:
            instance = await Note.objects.aget(id=pk, user=request.user)
            await instance.adelete()
            return Response({"message": "note deleted"}, status=200)
        except Note.DoesNotExist as ex:
            return Response({"error": "permission denied or not found"}, status=403)
        except Exception as ex:
            return Response({"error": str(ex)}, status=500)
        
    
    async def list(self, request: Request):
        
        """
        Return all user notes
        """
        
        try:
            user_notes = await sync_to_async(list)(Note.objects.filter(user=request.user))
            serializer = NoteSerializer(instance=user_notes, many=True)
            return Response(await serializer.adata, status=200)
        except Exception as ex:
            return Response({"error": str(ex)}, status=500)

    
    async def update(self, request: Request, pk=None):
        
        """
        Updating note
        """

        try:
            instance = await Note.objects.aget(id=pk, user=request.user)
            serializer = NoteSerializer(data={**request.data, "user": request.user.id}, instance = instance)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            await serializer.asave()
            return Response({"message": "note updated"}, status=200)
        except Note.DoesNotExist as ex:
            return Response({"error": "permission denied or not found"}, status=403)
        except Exception as ex:
            return Response({"error": str(ex)}, status=500)
        


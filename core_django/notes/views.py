import os
import httpx
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import *  
from .db_client import NoteRepo, UserRepo
from django.core.exceptions import ValidationError
from django.contrib.auth import aauthenticate, alogin, logout
from django.db import IntegrityError
import json
from asgiref.sync import sync_to_async

#checking authorization
async def check_auth(request: HttpRequest):
    if request.user.is_authenticated:
        return JsonResponse({"message": "authenticated", "id": request.user.id}, status=200)
    else:
        return JsonResponse({"error": "unauthorized"}, status=401)

#api method for adding users
@require_POST
async def add_user(request: HttpRequest):
    try:
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        repo = UserRepo()
        user = await repo.create(kwargs)
        await alogin(request, user)
        return JsonResponse({"message": "success"}, status=200)
    except IntegrityError as ex:
        return JsonResponse({"error": "username is already taken"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)



#api method for authorization
@require_POST
async def authorize(request: HttpRequest):
    try:
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        
        user = await aauthenticate(request, username=kwargs["username"], password=kwargs["password"] )
        
        if user is not None: 
            await alogin(request, user)
            return JsonResponse({"message": "success"}, status=200)
        else:
            return JsonResponse({"error": "invalid password or username"}, status=400)
        
    except ValidationError:    
        return JsonResponse({"error": "invalid password or username"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)


# logout method
@require_POST
async def logout_user(request: HttpRequest):
    await sync_to_async(logout)(request)
    return JsonResponse({"message": "user loged out"}, status=200)


#api method for creating notes
@require_POST
async def create_note(request: HttpRequest):
    try:
        chat_url = os.getenv('AI_CHAT_URL')
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        name = kwargs["name"]
        text = kwargs["text"]
        user = request.user
        note_repo = NoteRepo()
        new_note = await note_repo.create(name = name, text = text, user = user)

        return JsonResponse({"message": "note added", "id": new_note.id}, status=200)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)

#api method for deleting notes
@require_POST
async def delete_note(request: HttpRequest):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        note_repo = NoteRepo()
        note = await note_repo.get_by_id_and_user(kwargs["id"], user=request.user)
        await note_repo.delete_by_id(kwargs["id"])
        return JsonResponse({"message": "note deleted"}, status=200)
    except ValidationError as ex:
        return JsonResponse({"error": "permission denied or not found"}, status=403)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)
    
#api method for getting user notes
@require_GET
async def get_notes(request: HttpRequest):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        note_repo = NoteRepo()
        notes = await sync_to_async(list)(note_repo.get_user_notes(request.user).values())
        return JsonResponse(notes, status=200, safe=False)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)

@require_POST
async def update_note(request: HttpRequest):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        note_repo = NoteRepo()
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        name = kwargs["name"]
        text = kwargs["text"]
        note = await note_repo.get_by_id_and_user(kwargs["id"], user=request.user)
        await note_repo.update(note, name=name, text=text)
        return JsonResponse({"message": "note updated"}, status=200)
    except ValidationError as ex:
        return JsonResponse({"error": "permission denied or not found"}, status=403)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)
    


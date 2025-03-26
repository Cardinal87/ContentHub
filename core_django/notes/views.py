from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views.decorators.http import *  
from .db_client import NoteRepo, UserRepo
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.auth import aauthenticate, alogin, logout
from django.shortcuts import redirect, render
from django.db import IntegrityError
from asgiref.sync import sync_to_async
import json

#checking authorization
def check_auth(request: HttpRequest):
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
        user = await sync_to_async(repo.create)(kwargs)
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
def logout_user(request: HttpRequest):
    logout(request)
    return JsonResponse({"message": "user loged out"}, status=200)


#api method for creating notes
@require_POST
def create_note(request: HttpRequest):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        name = kwargs["name"]
        text = kwargs["text"]
        user = request.user
        note_repo = NoteRepo()
        new_note = note_repo.create(name = name, text = text, user = user)
        return JsonResponse({"message": "note added", "id": new_note.id}, status=200)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)

#api method for deleting notes
@require_POST
def delete_note(request: HttpRequest):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        note_repo = NoteRepo()
        note = note_repo.get_by_id(kwargs["id"])
        if note.user != request.user:
            return JsonResponse({"error": "permission denied"}, status=403)

        note_repo.delete_by_id(kwargs["id"])
        return JsonResponse({"message": "note deleted"}, status=200)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)
    
#api method for getting user notes
@require_GET
def get_notes(request: HttpRequest):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        note_repo = NoteRepo()
        notes = list(note_repo.get_user_notes(request.user).values())
        return JsonResponse(notes, status=200, safe=False)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)

@require_POST
def update_note(request: HttpRequest):
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"error": "unauthorized"}, status=401)
        note_repo = NoteRepo()
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        name = kwargs["name"]
        text = kwargs["text"]
        note = note_repo.get_by_id(kwargs["id"])
        if note.user != request.user:
            return JsonResponse({"error": "permission denied"}, status=403)
        note_repo.update(note, name=name, text=text)
        return JsonResponse({"message": "note updated"}, status=200)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=500)
    


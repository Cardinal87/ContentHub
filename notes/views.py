from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views.decorators.http import *  
from .db_client import NoteRepo, UserRepo
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.auth import aauthenticate, alogin, logout
from django.shortcuts import redirect, render

import json


#checking authorization
def check_auth(request: HttpRequest):
    if request.user.is_authenticated:
        return JsonResponse({"message": "authenticated"}, status=200)
    else:
        return JsonResponse({"error": "unauthorized"}, status=401)

#api method for adding users
@require_POST
async def add_user(request: HttpRequest):
    try:
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        repo = UserRepo()
        user = repo.create(kwargs)
        await alogin(request, user)
        return JsonResponse({"message": "success"}, status=200)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=400)



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
            return JsonResponse({"error": "invalid password or user"}, status=400)
        
    except ValidationError:    
        return JsonResponse({"error": "invalid password or user"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=400)


# logout method
def logout(request: HttpRequest):
    logout(request)
    return JsonResponse({"message": "successed"}, status=200)


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
        note_repo.create(name = name, text = text, user = user)
        return JsonResponse({"error": "note added"}, status=200)
    except Exception as ex:
        return JsonResponse({"error": str(ex)}, status=400)

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
        return JsonResponse({"error": str(ex)}, status=400)
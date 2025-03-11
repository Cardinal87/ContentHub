from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseBadRequest, HttpRequest
from django.views.decorators.http import *  
from .db_client import NoteRepo, UserRepo
from django.core.exceptions import ValidationError, ObjectDoesNotExist

import json

@require_GET
def get_auth_page(request):
    return HttpResponse("")

@require_GET
def get_notes_page():
    return HttpResponse("")



'''api method for adding users'''
@require_POST
def add_user(request: HttpRequest):
    try:
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        repo = UserRepo()
        repo.create(kwargs)
        return HttpResponse("User added")
    except Exception as ex:
        return HttpResponseBadRequest(f"{str(ex)}")



'''api method for authorization'''
@require_GET
def authorize(request: HttpRequest):
    try:
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        
        user_repo = UserRepo()
        user = user_repo.get_by_name(kwargs["username"])
        res = user.check_password(kwargs["password"])
        if not res:
            raise ValidationError("incorrect password")
        notes_repo = NoteRepo()
        notes = notes_repo.get_user_notes(user)
        return HttpResponse(notes)
        
    except ValidationError:    
        return HttpResponseBadRequest("Invalid password or login")
    except Exception as ex:
        return HttpResponseBadRequest(f"{ex}")


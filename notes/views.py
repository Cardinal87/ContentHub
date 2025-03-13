from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse, HttpRequest
from django.views.decorators.http import *  
from .db_client import NoteRepo, UserRepo
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.auth import aauthenticate, alogin, logout
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required

import json


def get_auth_page(request: HttpRequest):
    return HttpResponse("")

@login_required
def get_main_page(request: HttpRequest):
    return HttpResponse("")



#api method for adding users
@require_POST
async def add_user(request: HttpRequest):
    try:
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        repo = UserRepo()
        user = repo.create(kwargs)
        await alogin(request, user)
        return redirect('')
    except Exception as ex:
        return JsonResponse({"error": f"{ex}"}, status=400)



#api method for authorization
@require_POST
async def authorize(request: HttpRequest):
    try:
        decoded = request.body.decode()
        kwargs = json.loads(decoded)
        
        user = await aauthenticate(request, username=kwargs["username"], password=kwargs["password"] )
        
        if user is not None: 
            await alogin(request, user)
            return redirect('')
        else:
            JsonResponse({"error": "invalid password or user"}, status=400)
        
    except ValidationError:    
        return JsonResponse({"error": "invalid password or user"}, status=400)
    except Exception as ex:
        return JsonResponse({"error": f"{ex}"}, status=400)


# logout method
def logout(request: HttpRequest):
    logout(request)
    return redirect('login')




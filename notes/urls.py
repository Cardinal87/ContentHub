from . import views
from django.urls import path


urlpatterns = [
    path('api/add', views.add_user, name="add-user"),
    path('api/login', views.authorize, name="login")
    

]
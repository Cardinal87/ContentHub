from . import views
from django.urls import path


urlpatterns = [
    path('', views.get_auth_page),
    path('adduser', views.add_user),
    path('auth', views.authorize)

]
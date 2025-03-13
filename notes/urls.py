from . import views
from django.urls import path


urlpatterns = [
    path('', views.get_main_page, name="main-page"),
    path('login', views.get_auth_page, name="auth-page"),
    path('adduser', views.add_user, name="add-user"),
    path('auth', views.authorize, name="auth")

]
from . import views
from django.urls import path


urlpatterns = [
    path('', views.get_main_page, name="main-page"),
    path('authpage/', views.get_auth_page, name="auth-page"),
    path('adduserpage/', views.get_create_user_page, name="add-user-page"),
    path('adduser/', views.add_user, name="add-user"),
    path('auth/', views.authorize, name="auth")

]
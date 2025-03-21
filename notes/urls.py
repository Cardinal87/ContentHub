from . import views
from django.urls import path


urlpatterns = [
    path('api/add/', views.add_user, name="add-user"),
    path('api/login/', views.authorize, name="login"),
    path("api/check/", views.check_auth, name="check"),
    path("api/logout/", views.logout_user, name="logout"),
    path("api/deletenote/", views.delete_note, name="deletenote"),
    path("api/createnote/", views.create_note, name="createnote")
    

]
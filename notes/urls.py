from . import views
from django.urls import path


urlpatterns = [
    path('api/add/', views.add_user, name="add-user"),
    path('api/login/', views.authorize, name="login"),
    path("api/check/", views.check_auth, name="check"),
    path("api/logout/", views.logout_user, name="logout"),
    path("api/deletenote/", views.delete_note, name="delete_note"),
    path("api/createnote/", views.create_note, name="create_note"),
    path("api/getnotes/", views.get_notes, name="get_notes"),
    path('api/updatenote/', views.update_note, name="update_note"),
    path('api/getanswer/', views.get_rag_answer)
    

]
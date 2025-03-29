from . import views
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"v1/users", viewset=views.UsersViewSet, basename='users')
router.register(r'v1/auth', viewset=views.AuthenticationViewSet, basename='auth')
router.register(r'v1/notes', viewset=views.NotesViewSet, basename="notes")

urlpatterns = router.urls


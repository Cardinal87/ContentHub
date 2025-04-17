from adrf import serializers
from rest_framework import serializers as drf_serializers
from django.contrib.auth.models import User
from .models import Note
from asgiref.sync import sync_to_async
from django.contrib.auth.password_validation import validate_password


class PasswordSerializer(serializers.Serializer):
    new_password = drf_serializers.CharField(
        required = True,
        validators = [validate_password] 
    )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class NoteSerializer(serializers.ModelSerializer):
    vector_uuid = drf_serializers.UUIDField(required=False)
    
    class Meta:
        model = Note
        fields = "__all__"
    
    
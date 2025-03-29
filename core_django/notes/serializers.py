from adrf import serializers
from django.contrib.auth.models import User
from .models import Note
from asgiref.sync import sync_to_async

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        read_only_fields = ['id']


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"
    
    
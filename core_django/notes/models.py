from django.db import models
from django.contrib.auth.models import User
import uuid

class Note(models.Model):
    name = models.CharField(max_length=100)
    text = models.TextField(max_length=10000)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    vector_uuid = models.UUIDField(editable=False, null=True, blank=True)
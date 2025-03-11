from django.db import models

class User(models.Model):
    hash = models.CharField(max_length=32)
    name = models.CharField(max_length=100)


class Note(models.Model):
    name = models.CharField(max_length=100)
    text = models.TextField(max_length=10000)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
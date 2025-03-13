from .models import Note
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

#CRUD operations for User
class UserRepo():
    allowed_attrs = ["username", "password"]
    
    def create(self, kwargs):
        user = User.objects.create_user(
            username=kwargs.get("username"),
            password=kwargs.get("password"),
        )
        return user
        
    def get_all(self):
        return User.objects.all()
    
    def get_by_id(self, id:  int):
        return User.objects.get(id=id)

    def get_by_name(self, name: str):
        try:
            return User.objects.get(username=name)
        except User.DoesNotExist:
            raise ValidationError("incorrect username")

    def delete_by_id(self, id: int):
        User.objects.get(id=id).delete()

    def update(self, user: User, kwargs):
        for key, value in kwargs.items():
            if key not in self.allowed_attrs:
                raise ValidationError(f"{key} attribute is not allowed to change")
            setattr(user, key, value)
        user.save()


#CRUD operations for Note
class NoteRepo():
    allowed_attrs = ["text", "name"]
    def create(self, kwargs):
        note = Note.objects.create(
            name=kwargs.get("name"),
            text=kwargs.get("text"),
            user=kwargs.get("user")
        )
        return note
    
    def get_all(self):
        return Note.objects.all()

    def get_by_id(self, id: int):
        return Note.objects.get(id= id)

    def get_user_notes(self, user: User):
        return Note.objects.filter(user=user)
    
    def delete_by_id(self, id: int):
        Note.objects.get(id=id).delete()

    def update(self, note: Note, kwargs):
        for key, value in kwargs.items():
            if key not in self.allowed_attrs:
                raise ValueError(f"{key} attribute is not allowed to change")
            setattr(note, key, value)
        note.save()
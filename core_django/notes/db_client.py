from .models import Note
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from asgiref.sync import sync_to_async

#CRUD operations for User
class UserRepo():
    allowed_attrs = ["username", "password"]
    
    async def create(self, kwargs):
        user = await sync_to_async(User.objects.create_user)(
            username=kwargs.get("username"),
            password=kwargs.get("password"),
        )
        return user
        
    def get_all(self):
        return User.objects.all()
    
    async def get_by_id(self, id:  int):
        return await User.objects.aget(id=id)

    async def get_by_name(self, name: str):
        try:
            return await User.objects.aget(username=name)
        except User.DoesNotExist:
            raise ValidationError("incorrect username")

    async def delete_by_id(self, id: int):
        user = await User.objects.aget(id=id)
        await user.adelete()

    async def update(self, user: User, kwargs):
        for key, value in kwargs.items():
            if key not in self.allowed_attrs:
                raise ValidationError(f"{key} attribute is not allowed to change")
            setattr(user, key, value)
        await user.asave()


#CRUD operations for Note
class NoteRepo():
    allowed_attrs = ["text", "name"]
    async def create(self, **kwargs):
        note = await Note.objects.acreate(
            name=kwargs.get("name"),
            text=kwargs.get("text"),
            user=kwargs.get("user")
        )
        return note
    
    def get_all(self):
        return Note.objects.all()

    async def get_by_id(self, id: int):
        return await Note.objects.aget(id= id)

    def get_user_notes(self, user: User):
        return Note.objects.filter(user=user)
    
    async def get_by_id_and_user(self, id: int, user: User):
        try:
            return await Note.objects.aget(id=id, user=user)
        except:
            raise ValidationError("Not found or permission denied")

    async def delete_by_id(self, id: int):
        note = await Note.objects.aget(id=id)
        await note.adelete()

    async def update(self, note: Note, **kwargs):
        for key, value in kwargs.items():
            if key not in self.allowed_attrs:
                raise ValueError(f"{key} attribute is not allowed to change")
            setattr(note, key, value)
        note.asave()
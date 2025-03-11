from models import User, Note

'''class with CRUD operation for User'''
class UserRepo():
    def create(self, user: Note):
        user.save()
    
    def get_all(self):
        return User.objects.all()
    
    def get_by_id(self, id:  int):
        return User.objects.get(id=id)

    def get_by_name(self, name: str):
        return User.objects.filter(name=name)

    def delete_by_id(self, id: int):
        User.objects.get(id=id).delete()

    def update(self, user: User, **kwargs):
        for key, value in kwargs.items():
            setattr(user, key, value)
        user.save()


'''class with CRUD operation for User'''
class NoteRepo():
    def create(self, note: Note):
        note.save()
    
    def get_all(self):
        return Note.objects.all()

    def get_by_id(self, id: int):
        return Note.objects.get(id= id)

    def get_user_notes(user: User):
        return Note.objects.filter(user=user)
    
    def delete_by_id(self, id: int):
        Note.objects.get(id=id).delete()

    def update(self, note: Note, **kwargs):
        for key, value in kwargs.items():
            setattr(note, key, value)
        note.save()
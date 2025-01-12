from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=50)
    

from django.core.files.storage import default_storage
from storages.backends.s3boto3 import S3Boto3Storage
from django.core.files.storage import FileSystemStorage
from .custom_storage import CustomS3Storage

class Book(models.Model):
    title = models.CharField(max_length=200)
    book_image = models.ImageField(upload_to='bookStore-images/',storage=CustomS3Storage(), blank=True)
    
    description = models.TextField(blank=True)
    author = models.CharField(max_length=100)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    added_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        print("Default storage location:", default_storage)
        print("Cover image name:", self.book_image.name)
        print("Is default storage S3?:", isinstance(default_storage, S3Boto3Storage))
        super().save(*args, **kwargs)
from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=50)
    

class Book(models.Model):
    title = models.CharField(max_length=200)
    book_image = models.ImageField(upload_to='book-images', blank=True)
    description = models.TextField(blank=True)
    author = models.CharField(max_length=100)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    added_date = models.DateTimeField(auto_now_add=True)
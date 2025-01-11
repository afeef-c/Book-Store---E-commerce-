from django.db import models
from django.contrib.auth.models import User
from books.models import Book





class Preference(models.Model):
    LIKE = 'like'
    DISLIKE = 'dislike'
    PREFERENCE_CHOICES = [
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    preference = models.CharField(max_length=7,null=True, choices=PREFERENCE_CHOICES)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user} - {self.book} - {self.preference}"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    date_added = models.DateTimeField(auto_now_add=True)
    price_at_addition = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('cart', 'book')
    
    def sub_total(self):
        return self.book.price * self.quantity

    def __str__(self) -> str:
        return self.book.title



class Order(models.Model):
    STATUS_CHOICES = (
        ('pending','Pending'),
        ('placed','Placed'),
        ('shipped','Shipped'),
        ('delivered','Delivered')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    phone_number = models.CharField(max_length=15)
    payment_method = models.CharField(max_length=50, default="COD")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    book_price = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return self.product.product_name
    











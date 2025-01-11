from django.contrib import admin
from .models import Cart,OrderItem,Order,Preference,CartItem
# Register your models here.


admin.site.register(Order)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(OrderItem)
admin.site.register(Preference)
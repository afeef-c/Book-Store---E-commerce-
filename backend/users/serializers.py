from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from books.serializers import BookSerializer
from .models import Order, OrderItem,Cart, CartItem,Preference




class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ['username', 'password']
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.") 
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','id', 'password','is_staff']


class OrderItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book = BookSerializer(read_only=True)  # Use the nested serializer for the book field
    
    class Meta:
        model = OrderItem
        fields = ['id', 'book', 'book_title', 'quantity', 'book_price', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)  
    # status_display = serializers.CharField(source='get_status_display', read_only=True)
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'phone_number', 'payment_method', 'status', 'created_at', 'items']



class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)  # Use the nested serializer for the book field
    book_title = serializers.CharField(source='book.title', read_only=True)
    sub_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'book', 'book_title', 'quantity', 'price_at_addition', 'sub_total']

    def get_sub_total(self, obj):
        return obj.sub_total()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'total_price', 'items']

    def get_total_price(self, obj):
        # Calculate the total price as the sum of sub_total for all items in the cart
        return sum(item.sub_total() for item in obj.items.all())


class PreferenceSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    
    class Meta:
        model = Preference
        fields = ['id', 'user', 'book', 'book_title', 'preference']
        read_only_fields = ['user']
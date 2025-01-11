from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from .models import Order,OrderItem,Cart,CartItem
from books.models import Book
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem,Order, OrderItem,Preference
from books.models import Book
from .serializers import CartSerializer, CartItemSerializer,OrderSerializer,PreferenceSerializer,CustomUserSerializer
from rest_framework import generics, permissions,status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
 
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem, Book
from .serializers import CartSerializer




class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ObtainTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class CartRetrieveCreateView(RetrieveAPIView, CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)

        try:
            cart = Cart.objects.get(user=self.request.user)
            return cart
        except Cart.DoesNotExist:
            raise Http404("Cart not found for this user.")
        
    def post(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        book_id = request.data.get('book')
        quantity = request.data.get('quantity', 1)

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            book=book,
            defaults={'quantity': quantity, 'price_at_addition': book.price}
        )

        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        # Recalculate total price
        cart.total_price = sum(item.sub_total() for item in cart.items.all())
        cart.save()

        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request):
        
        cart, created = Cart.objects.get_or_create(user=request.user)
        print(f"Cart: {cart}")  # Debugging line
        bookId = request.data.get('bookId')
        quantity = request.data.get('quantity')
        print("Book id and qut",bookId, quantity)
        try:
            book = Book.objects.get(id=bookId)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, book=book, defaults={'quantity': quantity, 'price_at_addition': book.price})

        if not created:
            cart_item.quantity += int(quantity)
            cart_item.save()

        # Recalculate total price
        cart.total_price = sum(item.sub_total() for item in cart.items.all())
        cart.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)





class CartItemDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
            cart_item.delete()
            # Update cart total price
            cart = Cart.objects.get(user=request.user)
            cart.total_price = sum(item.sub_total() for item in cart.items.all())
            cart.save()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            orders = Order.objects.all()
        else:
            orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        
        # Create an order from the cart
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        address = request.data.get('address')
        phone_number = request.data.get('phone_number')
        payment_method = request.data.get('payment_method', 'COD')

        if not address or not phone_number:
            return Response({'error': 'Address and phone number are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the order
        order = Order.objects.create(user=request.user, address=address, phone_number=phone_number, payment_method=payment_method)

        # Move cart items to order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                user=request.user,
                book=item.book,
                quantity=item.quantity,
                book_price=item.book.price,
            )

        # Clear the cart
        cart.items.all().delete()
        cart.total_price = 0
        cart.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        """
        Update the order status if the user is an admin.
        """
        if not request.user.is_staff:
            return Response({'error': 'Permission denied. Only admins can update orders.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the order has already been delivered
        if order.status == 'delivered':
            return Response({'error': 'Cannot update the status of a delivered order.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the new status from the request
        new_status = request.data.get('newStatus')
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status value.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the order status
        order.status = new_status
        order.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)



class PreferenceView(APIView):
    """
    Handles creating, updating, and toggling user preferences for books.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        book_id = request.query_params.get('book')  # Fetch book ID from query parameters
        if book_id:
            # preferences = Preference.objects.filter(user=request.user, book_id=book_id)
            preference = Preference.objects.get(user=request.user, book_id=book_id)
            data = {
                'book_id': preference.book.id,
                'preference': preference.preference,
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            preferences = Preference.objects.filter(user=request.user)

        serializer = PreferenceSerializer(preferences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        book_id = request.data.get('bookId')
        preference_value = request.data.get('preference')
        
        if not book_id or not preference_value:
            return Response({'error': 'Book and preference are required'}, status=status.HTTP_400_BAD_REQUEST)

        if preference_value not in ['like', 'dislike']:
            return Response({'error': 'Invalid preference value'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # book = Book.objects.get(id=book_id)
            book = get_object_or_404(Book, id=book_id)

        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the preference already exists
        preference, created = Preference.objects.get_or_create(user=request.user, book=book)

        if preference.preference == preference_value:
            # If the current preference matches the request, toggle it to `None`
            preference.preference = None
        else:
            # Otherwise, update it to the new preference
            preference.preference = preference_value

        preference.save()

        serializer = PreferenceSerializer(preference)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


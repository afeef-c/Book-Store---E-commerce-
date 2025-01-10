from django.urls import path
from .views import UserRegistrationView, ObtainTokenView,CartView,CartItemDeleteView,OrderView,PreferenceView,CurrentUserView
from rest_framework_simplejwt.views import  TokenRefreshView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', ObtainTokenView.as_view(), name='login'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile/', CurrentUserView.as_view(), name='profile'),
    
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/item/<int:item_id>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('orders/', OrderView.as_view(), name='orders'),

    path('preferences/', PreferenceView.as_view(), name='preferences'),


]

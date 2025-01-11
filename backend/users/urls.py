from django.urls import path
from .views import UserRegistrationView, ObtainTokenView,CartView,CartItemDeleteView,OrderView,PreferenceView,CurrentUserView,CartRetrieveCreateView,OrderUpdateView
from rest_framework_simplejwt.views import  TokenRefreshView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', ObtainTokenView.as_view(), name='login'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('profile/', CurrentUserView.as_view(), name='profile'),
    
    path('cart/', CartView.as_view(), name='cart'),
    path('add_to_cart/', CartRetrieveCreateView.as_view(), name='add-to-cart'),
    path('cart_item/<int:item_id>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('orders/', OrderView.as_view(), name='orders'),
    path('orders/<int:pk>/', OrderUpdateView.as_view(), name='order-update'),

    path('preferences/', PreferenceView.as_view(), name='preferences'),
    # path('current_preferences/<int:item_id>', PreferenceView.as_view(), name='preferences'),


]

from django.urls import path
from .views import BookListCreateView, BookDetailView,GenreListCreateView,BookSearchView,BookRecommendationView

urlpatterns = [
    path('', BookListCreateView.as_view(), name='book-list'),
    path('book_details/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('genre/', GenreListCreateView.as_view(), name='genre-create'),
    path('search/', BookSearchView.as_view(), name='book-search'),
    path('recommendations/', BookRecommendationView.as_view(), name='book-recommendations'),


]

from django.urls import path
from .views import BookListCreateView, BookDetailView,GenreListCreateView

urlpatterns = [
    path('', BookListCreateView.as_view(), name='book-list'),
    path('book_details/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('genre/', GenreListCreateView.as_view(), name='genre-create'),
]

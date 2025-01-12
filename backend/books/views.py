from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from users.models import Preference
from .models import Book,Genre
from .serializers import BookSerializer,BookGenreSerializer,BookSerializerWrite
from rest_framework import generics, permissions
import logging
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from random import choice





logger = logging.getLogger(__name__)



# class GenreListView(generics.ListAPIView):
#     queryset = Genre.objects.all()
#     serializer_class = BookGenreSerializer
#     permission_classes = [permissions.IsAdminUser] 


class GenreListCreateView(generics.ListCreateAPIView):
    queryset = Genre.objects.all()
    serializer_class = BookGenreSerializer
    permission_classes = [permissions.AllowAny]



class BookListCreateView(APIView):
    
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        print("data: ",request.data)
        serializer = BookSerializerWrite(data=request.data)
        if serializer.is_valid():
            print("Serialization valid")
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serialization invalid")
            

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class BookDetailView(APIView):
    
    def get_object(self, pk):
        try:
            return Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return None

    def get(self, request, pk):
        book = self.get_object(pk)
        if not book:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = BookSerializer(book)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def put(self, request, pk):
        logger.debug(f"Request data: {request.data}")
        book = self.get_object(pk)
        if not book:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.debug(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def delete(self, request, pk):
        book = self.get_object(pk)
        if not book:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        book.delete()
        return Response({'message': 'Book deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class BookSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')
        print("Check query: ",request, query)
        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)
        books = Book.objects.filter(title__icontains=query)  # Search by title
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BookRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get user preferences (liked genres)
        liked_books = Preference.objects.filter(user=user, preference='like').values_list('book', flat=True)
        uninteracted_books = Preference.objects.filter(user=user, preference__isnull=True).values_list('book', flat=True)

        liked_genres = Book.objects.filter(id__in=liked_books).values_list('genre', flat=True).distinct()

        # Exclude books the user has already interacted with
        excluded_books = Preference.objects.filter(user=user).values_list('book', flat=True)

        # Recommendation based on liked genres
        recommended_books = Book.objects.filter(
            genre__in=liked_genres
        ).exclude(
            id__in=excluded_books
        )

        # Add random suggestions outside preferred genres
        recommendations = list(recommended_books)[:4]  # Limit to 4 books from liked genres
        random_books = Book.objects.exclude(
            genre__in=liked_genres, id__in=excluded_books
        ).order_by('?')[:3]  # Fetch 3 random books outside preferred genres
        recommendations.extend(random_books)

        # Fallback for no preferences or no recommendations available
        if not recommendations:
            recommendations = list(Book.objects.exclude(id__in=excluded_books).order_by('-added_date')[:5])

        # Serialize the recommendations
        serializer = BookSerializer(recommendations, many=True)
        return Response(serializer.data, status=200)



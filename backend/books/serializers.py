from rest_framework import serializers
from .models import Genre,Book
from rest_framework.validators import UniqueValidator



class BookGenreSerializer(serializers.ModelSerializer):
    name = serializers.CharField( validators=[UniqueValidator(queryset=Genre.objects.all())] )
    class Meta:
        model = Genre
        fields = '__all__'



class BookSerializer(serializers.ModelSerializer):
    # genre = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all())  # Make genre accept IDs
    genre = BookGenreSerializer()
    class Meta:
        model = Book
        fields = '__all__'

class BookSerializerWrite(serializers.ModelSerializer):
    genre = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all())  # Make genre accept IDs
    
    class Meta:
        model = Book
        fields = '__all__'
        
    def create(self, validated_data):
        # Ensure the default storage is used
        return Book.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     request = self.context.get('request')
    #     user = request.user

    #     # If the user is not an admin, prevent updating the 'is_active' field
    #     if not user.is_staff and 'is_active' in validated_data:
    #         validated_data.pop('is_active')  # Remove the 'is_active' field from update

    #     # Proceed with the standard update
    #     return super().update(instance, validated_data)


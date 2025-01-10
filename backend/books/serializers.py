from rest_framework import serializers
from .models import Genre,Book
from rest_framework.validators import UniqueValidator



class BookGenreSerializer(serializers.ModelSerializer):
    name = serializers.CharField( validators=[UniqueValidator(queryset=Genre.objects.all())] )
    class Meta:
        model = Genre
        fields = '__all__'



class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user

        # If the user is not an admin, prevent updating the 'is_active' field
        if not user.is_staff and 'is_active' in validated_data:
            validated_data.pop('is_active')  # Remove the 'is_active' field from update

        # Proceed with the standard update
        return super().update(instance, validated_data)

from .models import CustomUser, FoodLog, FoodItem
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import models

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email")

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "password1", "password2",)
        extra_kwargs = {"password": {"write_only": True}}
    
    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Passwords Do Not Match")
        
        password = attrs.get("password1", "")
        if len(password) < 8:
            raise serializers.ValidationError("Passwords must be at least 8 characters!")
        
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password1")
        validated_data.pop("password2")

        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    
class FoodItemSerializer(serializers.ModelSerializer): #Work in Progress (Coming Soon!)
    class Meta:
        model = FoodItem
        fields = ['name', 'calories', 'protein', 'carbs', 'fat']

class FoodLogSerializer(serializers.ModelSerializer):  #Work in Progress (Coming Soon!)
    food_items = FoodItemSerializer(many=True, read_only=True)
    total_calories = serializers.SerializerMethodField()

    class Meta:
        model = FoodLog
        fields = ['id', 'date', 'food_items', 'total_calories']

    def get_total_calories(self, obj):
        return sum(item.calories for item in obj.food_items.all())
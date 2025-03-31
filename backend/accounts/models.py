from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return self.email

class FoodLog(models.Model): #Work in Progress (Coming Soon!)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

class FoodItem(models.Model): #Work in Progress (Coming Soon!)
    food_log = models.ForeignKey(FoodLog, related_name='food_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    calories = models.FloatField()
    protein = models.FloatField()
    carbs = models.FloatField()
    fat = models.FloatField()
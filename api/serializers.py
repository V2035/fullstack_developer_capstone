from rest_framework import serializers
from .models import Dealer, Review

class DealerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealer
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(source="dealer.name", read_only=True)
    class Meta:
        model = Review
        fields = ["id", "dealer", "dealer_name", "author", "name", "review", "sentiment", "created_at"]
        read_only_fields = ["author", "sentiment", "created_at"]

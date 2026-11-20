from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Dealer, Review
from .serializers import DealerSerializer, ReviewSerializer

@api_view(["GET"])
def dealers(request):
    qs = Dealer.objects.all().order_by("id")
    state = request.query_params.get("state")
    if state:
        qs = qs.filter(state__iexact=state)
    return Response(DealerSerializer(qs, many=True).data)

@api_view(["GET"])
def dealer_detail(request, dealer_id):
    try:
        dealer = Dealer.objects.get(pk=dealer_id)
    except Dealer.DoesNotExist:
        return Response({"error": "Dealer not found"}, status=404)
    return Response(DealerSerializer(dealer).data)

@api_view(["GET"])
def dealer_reviews(request, dealer_id):
    qs = Review.objects.filter(dealer_id=dealer_id).order_by("-created_at")
    return Response(ReviewSerializer(qs, many=True).data)

@api_view(["POST"])
def submit_review(request):
    serializer = ReviewSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    dealer_id = serializer.validated_data.get("dealer")
    if not Dealer.objects.filter(pk=dealer_id.pk).exists():
        return Response({"error": "Dealer not found"}, status=404)
    review = serializer.save(author=request.user if request.user.is_authenticated else None)
    return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

@api_view(["GET"])
def car_makes(request):
    # Placeholder response until the course car-make dataset is imported.
    return Response([])

@api_view(["POST"])
def analyze_sentiment(request):
    text = str(request.data.get("review", "")).lower()
    positive = ["fantastic", "great", "excellent", "good", "wonderful", "amazing", "love"]
    negative = ["bad", "poor", "terrible", "awful", "hate", "disappointing"]
    score = sum(word in text for word in positive) - sum(word in text for word in negative)
    sentiment = "positive" if score > 0 else "negative" if score < 0 else "neutral"
    return Response({"review": request.data.get("review", ""), "sentiment": sentiment})

@api_view(["POST"])
def login_user(request):
    user = authenticate(request, username=request.data.get("username"), password=request.data.get("password"))
    if not user:
        return Response({"error": "Invalid username or password"}, status=400)
    login(request, user)
    return Response({"message": "Login successful", "username": user.username})

@api_view(["POST"])
def logout_user(request):
    logout(request)
    return Response({"message": "Logout successful"})

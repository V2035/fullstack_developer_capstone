from django.urls import path
from . import views

urlpatterns = [
    path("dealers/", views.dealers, name="dealers"),
    path("dealers/<int:dealer_id>/", views.dealer_detail, name="dealer-detail"),
    path("dealers/<int:dealer_id>/reviews/", views.dealer_reviews, name="dealer-reviews"),
    path("reviews/", views.submit_review, name="submit-review"),
    path("car-makes/", views.car_makes, name="car-makes"),
    path("sentiment/", views.analyze_sentiment, name="sentiment"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
]

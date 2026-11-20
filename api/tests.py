from django.test import TestCase
from rest_framework.test import APIClient
from .models import Dealer

class DealerApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Dealer.objects.create(name="Sample Dealer", city="Wichita", state="Kansas")

    def test_dealer_list_returns_200(self):
        response = self.client.get("/api/dealers/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_state_filter_returns_match(self):
        response = self.client.get("/api/dealers/?state=Kansas")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

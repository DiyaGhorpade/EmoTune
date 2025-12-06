from django.urls import path
from .views import health_check,analyze_and_recommend

urlpatterns = [
    path('', health_check),
    path('analyze/', analyze_and_recommend),   
]

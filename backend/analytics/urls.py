from django.urls import path

from .views import SummaryView, MonthlySpendingView, CategoryDistributionView

urlpatterns = [
    path("summary/", SummaryView.as_view(), name="summary"),
    path("analytics/monthly/", MonthlySpendingView.as_view(), name="analytics-monthly"),
    path("analytics/category/", CategoryDistributionView.as_view(), name="analytics-category"),
]


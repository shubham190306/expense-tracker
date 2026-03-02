from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("users.urls")),
    path("api/", include("transactions.urls")),
    path("api/", include("analytics.urls")),
    path("api/", include("budgets.urls")),
]


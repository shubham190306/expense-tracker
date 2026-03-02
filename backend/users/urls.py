from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    TokenRefresh,
    MeView,
    ChangePasswordView,
    GoogleLoginRedirectView,
    GoogleCallbackView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefresh.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("auth/google/", GoogleLoginRedirectView.as_view(), name="google_login"),
    path("auth/google/callback/", GoogleCallbackView.as_view(), name="google_callback"),
]


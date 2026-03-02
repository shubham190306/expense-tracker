import requests
from django.conf import settings
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.shortcuts import redirect
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import UserSerializer

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


class RegisterView(generics.CreateAPIView):
    """
    POST /api/register
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    """
    POST /api/login
    Uses SimpleJWT's TokenObtainPairView under a custom URL.
    """


class TokenRefresh(TokenRefreshView):
    """
    POST /api/token/refresh
    """


class MeView(APIView):
    """
    GET /api/me
    Return basic profile information for the authenticated user.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ChangePasswordView(APIView):
    """
    POST /api/change-password/
    Payload: { "current_password": "...", "new_password": "..." }
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"detail": "current_password and new_password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        # Keep user logged in
        update_session_auth_hash(request, user)

        return Response({"detail": "Password updated successfully."})


class GoogleLoginRedirectView(APIView):
    """
    GET /api/auth/google/
    Redirects to Google OAuth consent screen.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        client_id = getattr(settings, "GOOGLE_CLIENT_ID", None)
        if not client_id:
            return Response(
                {"detail": "Google login is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        redirect_uri = request.build_absolute_uri("/api/auth/google/callback/")
        scope = "openid email profile"
        state = request.GET.get("state", "")
        url = (
            "https://accounts.google.com/o/oauth2/v2/auth"
            f"?client_id={client_id}"
            f"&redirect_uri={redirect_uri}"
            "&response_type=code"
            f"&scope={scope}"
            "&access_type=offline"
            "&prompt=consent"
        )
        if state:
            url += f"&state={state}"
        return redirect(url)


class GoogleCallbackView(APIView):
    """
    GET /api/auth/google/callback/?code=...
    Exchanges code for tokens, gets or creates user, returns JWT and redirects to frontend.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        code = request.GET.get("code")
        client_id = getattr(settings, "GOOGLE_CLIENT_ID", None)
        client_secret = getattr(settings, "GOOGLE_CLIENT_SECRET", None)
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173").rstrip("/")

        if not code or not client_id or not client_secret:
            return redirect(f"{frontend_url}/login?error=google_config")

        redirect_uri = request.build_absolute_uri("/api/auth/google/callback/")
        token_resp = requests.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10,
        )
        if token_resp.status_code != 200:
            return redirect(f"{frontend_url}/login?error=google_token")

        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            return redirect(f"{frontend_url}/login?error=google_token")

        userinfo_resp = requests.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        if userinfo_resp.status_code != 200:
            return redirect(f"{frontend_url}/login?error=google_userinfo")

        profile = userinfo_resp.json()
        email = profile.get("email")
        if not email:
            return redirect(f"{frontend_url}/login?error=google_no_email")

        user = User.objects.filter(email=email).first()
        if not user:
            username = email.split("@")[0]
            base_username = username[:150]
            username = base_username
            n = 0
            while User.objects.filter(username=username).exists():
                n += 1
                username = f"{base_username}{n}"[:150]
            user = User.objects.create(
                username=username,
                email=email,
                first_name=profile.get("given_name", ""),
                last_name=profile.get("family_name", ""),
            )
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        refresh_str = str(refresh)

        callback_url = f"{frontend_url}/auth/callback"
        params = f"access={access}&refresh={refresh_str}"
        return redirect(f"{callback_url}?{params}")


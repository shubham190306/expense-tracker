from rest_framework import permissions, viewsets

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """
    /api/transactions/ CRUD, filtered per authenticated user.
    Supports filters:
    - ?type=income|expense
    - ?category=<string>
    - ?start_date=YYYY-MM-DD
    - ?end_date=YYYY-MM-DD
    """

    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Transaction.objects.filter(user=user)

        tx_type = self.request.query_params.get("type")
        if tx_type in (Transaction.TYPE_INCOME, Transaction.TYPE_EXPENSE):
            qs = qs.filter(type=tx_type)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)

        start_date = self.request.query_params.get("start_date")
        if start_date:
            qs = qs.filter(date__gte=start_date)

        end_date = self.request.query_params.get("end_date")
        if end_date:
            qs = qs.filter(date__lte=end_date)

        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


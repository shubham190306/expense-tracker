from datetime import date, timedelta
from calendar import monthrange

from django.db.models import Sum, Q
from django.db.models.functions import Coalesce
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from transactions.models import Transaction

from .models import Budget
from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """
    /api/budgets/ CRUD per authenticated user.
    Includes extra actions for budget status tracking.
    """

    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], url_path="status")
    def status(self, request):
        """
        GET /api/budgets/status/?month=YYYY-MM (optional, defaults to current month)
        Returns spending vs budget for a specific month.
        """
        today = date.today()
        month_param = request.query_params.get("month")
        
        if month_param:
            try:
                year, month = map(int, month_param.split("-"))
                target_date = date(year, month, 1)
            except (ValueError, TypeError):
                target_date = today
        else:
            target_date = today

        month_start = target_date.replace(day=1)
        _, last_day = monthrange(month_start.year, month_start.month)
        month_end = date(month_start.year, month_start.month, last_day)

        budgets = Budget.objects.filter(user=request.user)
        tx = (
            Transaction.objects.filter(
                user=request.user,
                type=Transaction.TYPE_EXPENSE,
                date__gte=month_start,
                date__lte=month_end,
            )
            .values("category")
            .annotate(total=Coalesce(Sum("amount"), 0))
        )
        spent_by_category = {row["category"]: float(row["total"]) for row in tx}

        data = []
        for budget in budgets:
            spent = spent_by_category.get(budget.category, 0)
            limit = float(budget.monthly_limit)
            remaining = limit - spent
            percentage = (spent / limit * 100) if limit > 0 else 0
            
            data.append(
                {
                    "category": budget.category,
                    "monthly_limit": limit,
                    "spent": spent,
                    "remaining": remaining,
                    "percentage_used": round(percentage, 2),
                    "is_over_budget": spent > limit,
                }
            )
        return Response(data)

    @action(detail=False, methods=["get"], url_path="monthly-history")
    def monthly_history(self, request):
        """
        GET /api/budgets/monthly-history/?months=6 (optional, defaults to 6)
        Returns budget vs spending for the last N months.
        """
        months_count = int(request.query_params.get("months", 6))
        today = date.today()
        
        budgets = Budget.objects.filter(user=request.user)
        if not budgets.exists():
            return Response([])

        data = []
        for i in range(months_count):
            target_date = today - timedelta(days=30 * i)
            month_start = target_date.replace(day=1)
            _, last_day = monthrange(month_start.year, month_start.month)
            month_end = date(month_start.year, month_start.month, last_day)

            tx = (
                Transaction.objects.filter(
                    user=request.user,
                    type=Transaction.TYPE_EXPENSE,
                    date__gte=month_start,
                    date__lte=month_end,
                )
                .values("category")
                .annotate(total=Coalesce(Sum("amount"), 0))
            )
            spent_by_category = {row["category"]: float(row["total"]) for row in tx}

            month_data = {
                "month": month_start.strftime("%Y-%m"),
                "month_name": month_start.strftime("%b %Y"),
                "categories": [],
            }

            total_budget = 0
            total_spent = 0
            
            for budget in budgets:
                spent = spent_by_category.get(budget.category, 0)
                limit = float(budget.monthly_limit)
                total_budget += limit
                total_spent += spent
                
                month_data["categories"].append({
                    "category": budget.category,
                    "limit": limit,
                    "spent": spent,
                    "remaining": limit - spent,
                    "is_over_budget": spent > limit,
                })

            month_data["total_budget"] = total_budget
            month_data["total_spent"] = total_spent
            month_data["total_remaining"] = total_budget - total_spent
            month_data["is_over_budget"] = total_spent > total_budget
            
            data.append(month_data)

        return Response(data)


from calendar import monthrange
from datetime import date

from django.db.models import Sum
from django.db.models.functions import Coalesce
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from transactions.models import Transaction


class SummaryView(APIView):
    """
    GET /api/summary/
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Transaction.objects.filter(user=request.user)

        income = qs.filter(type=Transaction.TYPE_INCOME).aggregate(
            total=Coalesce(Sum("amount"), 0),
        )["total"]
        expense = qs.filter(type=Transaction.TYPE_EXPENSE).aggregate(
            total=Coalesce(Sum("amount"), 0),
        )["total"]
        balance = income - expense

        # Add current month budget status
        today = date.today()
        month_start = today.replace(day=1)
        _, last_day = monthrange(month_start.year, month_start.month)
        month_end = date(month_start.year, month_start.month, last_day)

        try:
            from budgets.models import Budget
            
            budgets = Budget.objects.filter(user=request.user)
            total_budget = sum(float(b.monthly_limit) for b in budgets)
            
            month_expenses = (
                Transaction.objects.filter(
                    user=request.user,
                    type=Transaction.TYPE_EXPENSE,
                    date__gte=month_start,
                    date__lte=month_end,
                )
                .aggregate(total=Coalesce(Sum("amount"), 0))["total"]
            )
            
            budget_status = {
                "total_budget": total_budget,
                "month_spent": float(month_expenses),
                "month_remaining": total_budget - float(month_expenses),
                "is_over_budget": float(month_expenses) > total_budget,
            }
        except ImportError:
            budget_status = None

        response_data = {
            "total_income": income,
            "total_expense": expense,
            "balance": balance,
        }
        
        if budget_status:
            response_data["budget_status"] = budget_status

        return Response(response_data)


class MonthlySpendingView(APIView):
    """
    GET /api/analytics/monthly/
    Aggregates expense by month.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = (
            Transaction.objects.filter(user=request.user, type=Transaction.TYPE_EXPENSE)
            .values("date__year", "date__month")
            .annotate(total=Coalesce(Sum("amount"), 0))
            .order_by("date__year", "date__month")
        )

        data = []
        for row in qs:
            year = row["date__year"]
            month = row["date__month"]
            month_name = date(year, month, 1).strftime("%b")
            data.append({"month": month_name, "total": row["total"]})

        return Response(data)


class CategoryDistributionView(APIView):
    """
    GET /api/analytics/category/
    Aggregates expense by category.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = (
            Transaction.objects.filter(user=request.user, type=Transaction.TYPE_EXPENSE)
            .values("category")
            .annotate(total=Coalesce(Sum("amount"), 0))
            .order_by("-total")
        )

        data = [{"category": row["category"], "total": row["total"]} for row in qs]
        return Response(data)


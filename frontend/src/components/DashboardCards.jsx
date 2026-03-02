import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2'
import { TbWallet, TbTargetArrow } from 'react-icons/tb'

export default function DashboardCards({ summary }) {
  const { total_income = 0, total_expense = 0, balance = 0, budget_status } = summary || {}

  return (
    <div className="cards-grid">
      <div className="card stat-card animate-in stagger-1">
        <div className="card-icon income"><HiArrowTrendingUp /></div>
        <h3>Total Income</h3>
        <p className="amount positive">₹{total_income.toLocaleString()}</p>
      </div>
      <div className="card stat-card animate-in stagger-2">
        <div className="card-icon expense"><HiArrowTrendingDown /></div>
        <h3>Total Expense</h3>
        <p className="amount negative">₹{total_expense.toLocaleString()}</p>
      </div>
      <div className="card stat-card animate-in stagger-3">
        <div className="card-icon balance"><TbWallet /></div>
        <h3>Balance</h3>
        <p className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>₹{balance.toLocaleString()}</p>
      </div>
      {budget_status && (
        <div className={`card stat-card animate-in stagger-4 ${budget_status.is_over_budget ? 'card-warning' : ''}`}>
          <div className="card-icon budget"><TbTargetArrow /></div>
          <h3>Monthly Budget</h3>
          <p className="amount">₹{budget_status.month_spent.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ ₹{budget_status.total_budget.toLocaleString()}</span></p>
          <div className="budget-progress">
            <div
              className={`budget-progress-bar ${budget_status.is_over_budget ? 'over-budget' : ''}`}
              style={{
                width: `${Math.min((budget_status.month_spent / budget_status.total_budget) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="budget-remaining">
            {budget_status.is_over_budget ? (
              <span className="negative">Over by ₹{Math.abs(budget_status.month_remaining).toLocaleString()}</span>
            ) : (
              <span className="positive">₹{budget_status.month_remaining.toLocaleString()} remaining</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}


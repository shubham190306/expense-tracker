import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import DashboardCards from '../components/DashboardCards'
import api from '../services/api'
import { HiCalendarDays, HiTag, HiArrowTrendingUp } from 'react-icons/hi2'
import { TbTargetArrow, TbHistory } from 'react-icons/tb'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [category, setCategory] = useState([])
  const [budgetStatus, setBudgetStatus] = useState([])
  const [budgetHistory, setBudgetHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, monthlyRes, categoryRes, budgetStatusRes, budgetHistoryRes] =
          await Promise.all([
            api.get('/summary/'),
            api.get('/analytics/monthly/'),
            api.get('/analytics/category/'),
            api.get('/budgets/status/').catch(() => ({ data: [] })),
            api.get('/budgets/monthly-history/?months=6').catch(() => ({ data: [] })),
          ])
        setSummary(summaryRes.data)
        setMonthly(monthlyRes.data)
        setCategory(categoryRes.data)
        setBudgetStatus(budgetStatusRes.data)
        setBudgetHistory(budgetHistoryRes.data)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const maxSpending = Math.max(...monthly.map((m) => m.total), 1)
  const maxCategory = Math.max(...category.map((c) => c.total), 1)

  return (
    <div className="layout">
      <Navbar />
      <div className="app-main">
        <Sidebar />
        <main className="content">
          <h2>Dashboard</h2>

          {loading ? (
            <div className="cards-grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="card skeleton" style={{ height: 120 }} />
              ))}
            </div>
          ) : (
            <DashboardCards summary={summary} />
          )}

          <section className="charts-grid">
            <div className="card animate-in stagger-2">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                <HiCalendarDays style={{ color: 'var(--accent)' }} /> Monthly Spending
              </h3>
              <ul className="chart-list">
                {loading ? (
                  [1,2,3].map(i => <li key={i}><div className="skeleton" style={{ width: '100%', height: 24 }} /></li>)
                ) : monthly.length === 0 ? (
                  <li className="empty-state">No spending data yet</li>
                ) : (
                  monthly.map((m) => (
                    <li key={m.month}>
                      <span>{m.month}</span>
                      <div className="bar-wrapper">
                        <div className="bar-track">
                          <div
                            className="bar"
                            style={{ width: `${Math.min((m.total / maxSpending) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="bar-value">₹{m.total.toLocaleString()}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="card animate-in stagger-3">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                <HiTag style={{ color: 'var(--accent-2)' }} /> By Category
              </h3>
              <ul className="chart-list">
                {loading ? (
                  [1,2,3].map(i => <li key={i}><div className="skeleton" style={{ width: '100%', height: 24 }} /></li>)
                ) : category.length === 0 ? (
                  <li className="empty-state">No category data yet</li>
                ) : (
                  category.map((c) => (
                    <li key={c.category}>
                      <span>{c.category}</span>
                      <div className="bar-wrapper">
                        <div className="bar-track">
                          <div
                            className="bar"
                            style={{ width: `${Math.min((c.total / maxCategory) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="bar-value">₹{c.total.toLocaleString()}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>

          {budgetStatus.length > 0 && (
            <section className="card animate-in" style={{ marginTop: 'var(--space-6)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                <TbTargetArrow style={{ color: 'var(--accent)' }} /> Budget Status
              </h3>
              <ul className="chart-list" style={{ marginTop: 'var(--space-4)' }}>
                {budgetStatus.map((b) => {
                  const percentage = (b.spent / b.monthly_limit) * 100
                  return (
                    <li key={b.category} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.35rem' }}>
                      <div className="budget-item-header">
                        <span style={{ fontWeight: 600 }}>{b.category}</span>
                        <span className={b.is_over_budget ? 'negative' : 'positive'} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                          ₹{b.spent.toLocaleString()} / ₹{b.monthly_limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="budget-progress">
                        <div
                          className={`budget-progress-bar ${b.is_over_budget ? 'over-budget' : ''}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="budget-meta">
                        <span className={b.is_over_budget ? 'negative' : ''} style={{ fontWeight: 500 }}>
                          {b.is_over_budget
                            ? `Over by ₹${Math.abs(b.remaining).toLocaleString()}`
                            : `₹${b.remaining.toLocaleString()} remaining`}
                        </span>
                        <span className="percentage-small">{percentage.toFixed(1)}%</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {budgetHistory.length > 0 && (
            <section className="card animate-in" style={{ marginTop: 'var(--space-6)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                <TbHistory style={{ color: 'var(--accent-2)' }} /> Budget History (6 Months)
              </h3>
              <div className="budget-history-chart">
                {budgetHistory.map((month) => {
                  const percentage = month.total_budget > 0
                    ? (month.total_spent / month.total_budget) * 100
                    : 0
                  return (
                    <div key={month.month} className="budget-history-item">
                      <div className="budget-history-header">
                        <span style={{ fontWeight: 600 }}>{month.month_name}</span>
                        <span className={month.is_over_budget ? 'negative' : 'positive'} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                          ₹{month.total_spent.toLocaleString()} / ₹{month.total_budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="budget-progress">
                        <div
                          className={`budget-progress-bar ${month.is_over_budget ? 'over-budget' : ''}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}


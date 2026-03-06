import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import DashboardCards from '../components/DashboardCards'
import GlowCard from '../components/GlowCard'
import api from '../services/api'
import { HiCalendarDays, HiTag, HiArrowTrendingUp } from 'react-icons/hi2'
import { TbTargetArrow, TbHistory } from 'react-icons/tb'

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

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
        <motion.main
          className="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Dashboard
          </motion.h2>

          {loading ? (
            <div className="cards-grid">
              {[1,2,3,4].map(i => (
                <motion.div
                  key={i}
                  className="card skeleton"
                  style={{ height: 120 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ))}
            </div>
          ) : (
            <DashboardCards summary={summary} />
          )}

          <motion.section
            className="charts-grid"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <GlowCard>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <HiCalendarDays style={{ color: 'var(--accent)' }} />
                  </motion.span>
                  Monthly Spending
                </h3>
                <ul className="chart-list">
                  {loading ? (
                    [1,2,3].map(i => <li key={i}><div className="skeleton" style={{ width: '100%', height: 24 }} /></li>)
                  ) : monthly.length === 0 ? (
                    <li className="empty-state">No spending data yet</li>
                  ) : (
                    monthly.map((m, idx) => (
                      <motion.li
                        key={m.month}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
                      >
                        <span>{m.month}</span>
                        <div className="bar-wrapper">
                          <div className="bar-track">
                            <motion.div
                              className="bar"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((m.total / maxSpending) * 100, 100)}%` }}
                              transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                          <span className="bar-value">₹{m.total.toLocaleString()}</span>
                        </div>
                      </motion.li>
                    ))
                  )}
                </ul>
              </GlowCard>
            </motion.div>
            <motion.div variants={fadeUp}>
              <GlowCard>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <HiTag style={{ color: 'var(--accent-2)' }} />
                  </motion.span>
                  By Category
                </h3>
                <ul className="chart-list">
                  {loading ? (
                    [1,2,3].map(i => <li key={i}><div className="skeleton" style={{ width: '100%', height: 24 }} /></li>)
                  ) : category.length === 0 ? (
                    <li className="empty-state">No category data yet</li>
                  ) : (
                    category.map((c, idx) => (
                      <motion.li
                        key={c.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
                      >
                        <span>{c.category}</span>
                        <div className="bar-wrapper">
                          <div className="bar-track">
                            <motion.div
                              className="bar"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((c.total / maxCategory) * 100, 100)}%` }}
                              transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                          <span className="bar-value">₹{c.total.toLocaleString()}</span>
                        </div>
                      </motion.li>
                    ))
                  )}
                </ul>
              </GlowCard>
            </motion.div>
          </motion.section>

          {budgetStatus.length > 0 && (
            <motion.section
              style={{ marginTop: 'var(--space-6)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <GlowCard>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <TbTargetArrow style={{ color: 'var(--accent)' }} />
                  </motion.span>
                  Budget Status
                </h3>
                <ul className="chart-list" style={{ marginTop: 'var(--space-4)' }}>
                  {budgetStatus.map((b, idx) => {
                    const percentage = (b.spent / b.monthly_limit) * 100
                    return (
                      <motion.li
                        key={b.category}
                        style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.35rem' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
                      >
                        <div className="budget-item-header">
                          <span style={{ fontWeight: 600 }}>{b.category}</span>
                          <span className={b.is_over_budget ? 'negative' : 'positive'} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                            ₹{b.spent.toLocaleString()} / ₹{b.monthly_limit.toLocaleString()}
                          </span>
                        </div>
                        <div className="budget-progress">
                          <motion.div
                            className={`budget-progress-bar ${b.is_over_budget ? 'over-budget' : ''}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 1.2, delay: 0.8 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                      </motion.li>
                    )
                  })}
                </ul>
              </GlowCard>
            </motion.section>
          )}

          {budgetHistory.length > 0 && (
            <motion.section
              style={{ marginTop: 'var(--space-6)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <GlowCard>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                  <motion.span
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    <TbHistory style={{ color: 'var(--accent-2)' }} />
                  </motion.span>
                  Budget History (6 Months)
                </h3>
                <div className="budget-history-chart">
                  {budgetHistory.map((month, idx) => {
                    const percentage = month.total_budget > 0
                      ? (month.total_spent / month.total_budget) * 100
                      : 0
                    return (
                      <motion.div
                        key={month.month}
                        className="budget-history-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + idx * 0.08, duration: 0.4 }}
                      >
                        <div className="budget-history-header">
                          <span style={{ fontWeight: 600 }}>{month.month_name}</span>
                          <span className={month.is_over_budget ? 'negative' : 'positive'} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                            ₹{month.total_spent.toLocaleString()} / ₹{month.total_budget.toLocaleString()}
                          </span>
                        </div>
                        <div className="budget-progress">
                          <motion.div
                            className={`budget-progress-bar ${month.is_over_budget ? 'over-budget' : ''}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 1.2, delay: 1 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </GlowCard>
            </motion.section>
          )}
        </motion.main>
      </div>
    </div>
  )
}


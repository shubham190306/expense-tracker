import { motion } from 'framer-motion'
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2'
import { TbWallet, TbTargetArrow } from 'react-icons/tb'
import CountUp from './CountUp'
import GlowCard from './GlowCard'

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

const iconPulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export default function DashboardCards({ summary }) {
  const { total_income = 0, total_expense = 0, balance = 0, budget_status } = summary || {}

  const cards = [
    {
      icon: <HiArrowTrendingUp />,
      iconClass: 'income',
      title: 'Total Income',
      amount: total_income,
      amountClass: 'positive',
      prefix: '₹',
    },
    {
      icon: <HiArrowTrendingDown />,
      iconClass: 'expense',
      title: 'Total Expense',
      amount: total_expense,
      amountClass: 'negative',
      prefix: '₹',
    },
    {
      icon: <TbWallet />,
      iconClass: 'balance',
      title: 'Balance',
      amount: balance,
      amountClass: balance >= 0 ? 'positive' : 'negative',
      prefix: '₹',
    },
  ]

  return (
    <div className="cards-grid">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <GlowCard className="stat-card">
            <motion.div className={`card-icon ${card.iconClass}`} {...iconPulse}>
              {card.icon}
            </motion.div>
            <h3>{card.title}</h3>
            <p className={`amount ${card.amountClass}`}>
              <CountUp end={card.amount} prefix={card.prefix} duration={1500} />
            </p>
          </GlowCard>
        </motion.div>
      ))}
      {budget_status && (
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <GlowCard className={`stat-card ${budget_status.is_over_budget ? 'card-warning' : ''}`}>
            <motion.div className="card-icon budget" {...iconPulse}>
              <TbTargetArrow />
            </motion.div>
            <h3>Monthly Budget</h3>
            <p className="amount">
              <CountUp end={budget_status.month_spent} prefix="₹" duration={1500} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                {' '}/ ₹{budget_status.total_budget.toLocaleString()}
              </span>
            </p>
            <div className="budget-progress" style={{ marginTop: 'var(--space-3)' }}>
              <motion.div
                className={`budget-progress-bar ${budget_status.is_over_budget ? 'over-budget' : ''}`}
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((budget_status.month_spent / budget_status.total_budget) * 100, 100)}%`,
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              />
            </div>
            <p className="budget-remaining">
              {budget_status.is_over_budget ? (
                <span className="negative">Over by ₹{Math.abs(budget_status.month_remaining).toLocaleString()}</span>
              ) : (
                <span className="positive">₹{budget_status.month_remaining.toLocaleString()} remaining</span>
              )}
            </p>
          </GlowCard>
        </motion.div>
      )}
    </div>
  )
}


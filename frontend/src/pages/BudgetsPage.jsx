import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import BudgetForm from '../components/BudgetForm'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiPlus, HiPencilSquare, HiTrash } from 'react-icons/hi2'
import { TbTargetArrow } from 'react-icons/tb'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([])
  const [budgetStatus, setBudgetStatus] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadBudgets = async () => {
    try {
      const [budgetsRes, statusRes] = await Promise.all([
        api.get('/budgets/'),
        api.get('/budgets/status/').catch(() => ({ data: [] })),
      ])
      setBudgets(budgetsRes.data.results || budgetsRes.data)
      setBudgetStatus(statusRes.data)
    } catch (err) {
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudgets()
  }, [])

  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (budget) => {
    setEditing(budget)
    setModalOpen(true)
  }

  const handleDelete = async (budget) => {
    if (!window.confirm(`Delete budget for ${budget.category}?`)) return
    try {
      await api.delete(`/budgets/${budget.id}/`)
      toast.success(`Budget for ${budget.category} deleted`)
      loadBudgets()
    } catch (err) {
      toast.error('Failed to delete budget')
    }
  }

  const handleSave = async (form) => {
    try {
      if (editing) {
        await api.put(`/budgets/${editing.id}/`, form)
        toast.success('Budget updated')
      } else {
        await api.post('/budgets/', form)
        toast.success('Budget created')
      }
      setModalOpen(false)
      setEditing(null)
      loadBudgets()
    } catch (err) {
      toast.error('Failed to save budget')
    }
  }

  const statusMap = budgetStatus.reduce((acc, s) => {
    acc[s.category] = s
    return acc
  }, {})

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
          <motion.header
            className="content-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h2>Budgets</h2>
            <motion.button
              className="btn-primary"
              onClick={handleAdd}
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 8px 30px rgba(56, 189, 248, 0.35)' }}
              whileTap={{ scale: 0.95 }}
            >
              <HiPlus /> Add Budget
            </motion.button>
          </motion.header>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="table-wrapper"
                style={{ padding: 'var(--space-8)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[1,2,3].map(i => (
                  <motion.div
                    key={i}
                    className="skeleton"
                    style={{ height: 40, marginBottom: 'var(--space-3)' }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            ) : budgets.length === 0 ? (
              <motion.div
                key="empty"
                className="card"
                style={{ textAlign: 'center', padding: 'var(--space-12)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <motion.div
                  style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)', opacity: 0.4 }}
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <TbTargetArrow />
                </motion.div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No budgets set yet. Create one to start tracking your spending!</p>
              </motion.div>
            ) : (
              <motion.div
                key="table"
                className="table-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th className="align-right">Monthly Limit</th>
                      <th className="align-right">Spent</th>
                      <th className="align-right">Remaining</th>
                      <th>Progress</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {budgets.map((budget, idx) => {
                        const status = statusMap[budget.category]
                        const spent = status?.spent || 0
                        const remaining = status?.remaining ?? budget.monthly_limit
                        const isOver = status?.is_over_budget || false
                        const percentage = status
                          ? (status.spent / budget.monthly_limit) * 100
                          : 0

                        return (
                          <motion.tr
                            key={budget.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ delay: idx * 0.06, duration: 0.4 }}
                            whileHover={{ backgroundColor: 'rgba(56, 189, 248, 0.04)' }}
                          >
                            <td style={{ fontWeight: 600 }}>{budget.category}</td>
                            <td className="align-right" style={{ fontVariantNumeric: 'tabular-nums' }}>₹{Number(budget.monthly_limit).toLocaleString()}</td>
                            <td className="align-right" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>₹{spent.toLocaleString()}</td>
                            <td className={`align-right ${isOver ? 'negative' : 'positive'}`} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                              {isOver ? '-' : ''}₹{Math.abs(remaining).toLocaleString()}
                            </td>
                            <td style={{ minWidth: 140 }}>
                              <div className="budget-progress-inline">
                                <div style={{ flex: 1, height: 6, borderRadius: 'var(--radius-full)', background: 'rgba(30,41,59,0.6)', overflow: 'hidden' }}>
                                  <motion.div
                                    className={`budget-progress-bar-small ${isOver ? 'over-budget' : ''}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.3 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                </div>
                                <span className="percentage-small">{percentage.toFixed(0)}%</span>
                              </div>
                            </td>
                            <td className="actions">
                              <motion.button
                                onClick={() => handleEdit(budget)}
                                className="btn-icon"
                                title="Edit"
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <HiPencilSquare size={15} />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(budget)}
                                className="btn-icon"
                                title="Delete"
                                style={{ borderColor: 'var(--danger-bg)', color: 'var(--danger)' }}
                                whileHover={{ scale: 1.15, borderColor: 'var(--danger)' }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <HiTrash size={15} />
                              </motion.button>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
      <Modal
        title={editing ? 'Edit Budget' : 'Add Budget'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
      >
        <BudgetForm
          initialData={editing}
          onSave={handleSave}
          onCancel={() => {
            setModalOpen(false)
            setEditing(null)
          }}
        />
      </Modal>
    </div>
  )
}

import { useEffect, useState } from 'react'
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
        <main className="content">
          <header className="content-header">
            <h2>Budgets</h2>
            <button className="btn-primary" onClick={handleAdd}>
              <HiPlus /> Add Budget
            </button>
          </header>

          {loading ? (
            <div className="table-wrapper" style={{ padding: 'var(--space-8)' }}>
              {[1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: 40, marginBottom: 'var(--space-3)' }} />
              ))}
            </div>
          ) : budgets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)', opacity: 0.4 }}><TbTargetArrow /></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No budgets set yet. Create one to start tracking your spending!</p>
            </div>
          ) : (
            <div className="table-wrapper">
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
                  {budgets.map((budget) => {
                    const status = statusMap[budget.category]
                    const spent = status?.spent || 0
                    const remaining = status?.remaining ?? budget.monthly_limit
                    const isOver = status?.is_over_budget || false
                    const percentage = status
                      ? (status.spent / budget.monthly_limit) * 100
                      : 0

                    return (
                      <tr key={budget.id}>
                        <td style={{ fontWeight: 600 }}>{budget.category}</td>
                        <td className="align-right" style={{ fontVariantNumeric: 'tabular-nums' }}>₹{Number(budget.monthly_limit).toLocaleString()}</td>
                        <td className="align-right" style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>₹{spent.toLocaleString()}</td>
                        <td className={`align-right ${isOver ? 'negative' : 'positive'}`} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                          {isOver ? '-' : ''}₹{Math.abs(remaining).toLocaleString()}
                        </td>
                        <td style={{ minWidth: 140 }}>
                          <div className="budget-progress-inline">
                            <div style={{ flex: 1, height: 6, borderRadius: 'var(--radius-full)', background: 'rgba(30,41,59,0.6)', overflow: 'hidden' }}>
                              <div
                                className={`budget-progress-bar-small ${isOver ? 'over-budget' : ''}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            <span className="percentage-small">{percentage.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="actions">
                          <button onClick={() => handleEdit(budget)} className="btn-icon" title="Edit">
                            <HiPencilSquare size={15} />
                          </button>
                          <button onClick={() => handleDelete(budget)} className="btn-icon" title="Delete" style={{ borderColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
                            <HiTrash size={15} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
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

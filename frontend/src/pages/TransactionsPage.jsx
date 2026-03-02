import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import FiltersPanel from '../components/FiltersPanel'
import TransactionTable from '../components/TransactionTable'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiPlus } from 'react-icons/hi2'

const defaultFilters = {
  type: '',
  category: '',
  start_date: '',
  end_date: '',
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState(defaultFilters)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadTransactions = async (pageToLoad = page, nextFilters = filters) => {
    const params = {
      page: pageToLoad,
      ...Object.fromEntries(
        Object.entries(nextFilters).filter(([, value]) => value !== '' && value !== null),
      ),
    }
    try {
      const res = await api.get('/transactions/', { params })
      setTransactions(res.data.results || res.data)
      if (res.data.count && res.data.results) {
        setTotalPages(Math.ceil(res.data.count / 10))
      } else {
        setTotalPages(1)
      }
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFiltersChange = (next) => {
    setFilters(next)
    setPage(1)
    loadTransactions(1, next)
  }

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setPage(1)
    loadTransactions(1, defaultFilters)
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    loadTransactions(nextPage)
  }

  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (tx) => {
    setEditing(tx)
    setModalOpen(true)
  }

  const handleDelete = async (tx) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await api.delete(`/transactions/${tx.id}/`)
      toast.success('Transaction deleted')
      loadTransactions()
    } catch {
      toast.error('Failed to delete transaction')
    }
  }

  const handleSave = async (form) => {
    try {
      if (editing) {
        await api.put(`/transactions/${editing.id}/`, form)
        toast.success('Transaction updated')
      } else {
        await api.post('/transactions/', form)
        toast.success('Transaction added')
      }
      setModalOpen(false)
      setEditing(null)
      loadTransactions()
    } catch {
      toast.error('Failed to save transaction')
    }
  }

  return (
    <div className="layout">
      <Navbar />
      <div className="app-main">
        <Sidebar />
        <main className="content">
          <header className="content-header">
            <h2>Transactions</h2>
            <button className="btn-primary" onClick={handleAdd}>
              <HiPlus /> Add transaction
            </button>
          </header>
          <FiltersPanel filters={filters} onChange={handleFiltersChange} onReset={handleResetFilters} />
          {loading ? (
            <div className="table-wrapper" style={{ padding: 'var(--space-8)' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="skeleton" style={{ height: 40, marginBottom: 'var(--space-3)' }} />
              ))}
            </div>
          ) : (
            <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </main>
      </div>
      <Modal
        title={editing ? 'Edit transaction' : 'Add transaction'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
      >
        <TransactionForm
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


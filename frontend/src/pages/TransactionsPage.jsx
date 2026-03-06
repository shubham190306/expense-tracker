import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
            <h2>Transactions</h2>
            <motion.button
              className="btn-primary"
              onClick={handleAdd}
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 8px 30px rgba(56, 189, 248, 0.35)' }}
              whileTap={{ scale: 0.95 }}
            >
              <HiPlus /> Add transaction
            </motion.button>
          </motion.header>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <FiltersPanel filters={filters} onChange={handleFiltersChange} onReset={handleResetFilters} />
          </motion.div>
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
                {[1,2,3,4,5].map(i => (
                  <motion.div
                    key={i}
                    className="skeleton"
                    style={{ height: 40, marginBottom: 'var(--space-3)' }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </motion.div>
        </motion.main>
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


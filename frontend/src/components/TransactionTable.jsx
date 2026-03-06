import { motion, AnimatePresence } from 'framer-motion'
import { HiPencilSquare, HiTrash } from 'react-icons/hi2'
import { TbReceipt } from 'react-icons/tb'

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.95,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <motion.div
      className="table-wrapper"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th className="align-right">Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan="6" className="empty-state">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <motion.div
                    className="empty-icon"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <TbReceipt />
                  </motion.div>
                  No transactions found. Add one to get started!
                </motion.div>
              </td>
            </tr>
          )}
          <AnimatePresence mode="popLayout">
            {transactions.map((tx, idx) => (
              <motion.tr
                key={tx.id}
                custom={idx}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                whileHover={{
                  backgroundColor: 'rgba(56, 189, 248, 0.04)',
                  transition: { duration: 0.15 },
                }}
              >
                <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                <td>
                  <motion.span
                    className={tx.type === 'income' ? 'pill pill-income' : 'pill pill-expense'}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {tx.type}
                  </motion.span>
                </td>
                <td style={{ fontWeight: 500 }}>{tx.category}</td>
                <td style={{ color: 'var(--text-muted)' }}>{tx.description || '—'}</td>
                <td className={`align-right ${tx.type === 'income' ? 'positive' : 'negative'}`} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                </td>
                <td className="actions">
                  <motion.button
                    onClick={() => onEdit(tx)}
                    className="btn-icon"
                    title="Edit"
                    whileHover={{ scale: 1.15, borderColor: 'var(--accent)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <HiPencilSquare size={15} />
                  </motion.button>
                  <motion.button
                    onClick={() => onDelete(tx)}
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
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  )
}


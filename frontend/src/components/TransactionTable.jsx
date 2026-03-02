import { HiPencilSquare, HiTrash } from 'react-icons/hi2'
import { TbReceipt } from 'react-icons/tb'

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
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
                <div className="empty-icon"><TbReceipt /></div>
                No transactions found. Add one to get started!
              </td>
            </tr>
          )}
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
              <td>
                <span className={tx.type === 'income' ? 'pill pill-income' : 'pill pill-expense'}>
                  {tx.type}
                </span>
              </td>
              <td style={{ fontWeight: 500 }}>{tx.category}</td>
              <td style={{ color: 'var(--text-muted)' }}>{tx.description || '—'}</td>
              <td className={`align-right ${tx.type === 'income' ? 'positive' : 'negative'}`} style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
              </td>
              <td className="actions">
                <button onClick={() => onEdit(tx)} className="btn-icon" title="Edit">
                  <HiPencilSquare size={15} />
                </button>
                <button onClick={() => onDelete(tx)} className="btn-icon" title="Delete" style={{ borderColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
                  <HiTrash size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


import { useEffect, useState } from 'react'

const initialForm = {
  amount: '',
  type: 'expense',
  category: '',
  description: '',
  date: '',
}

export default function TransactionForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setForm({
        amount: initialData.amount,
        type: initialData.type,
        category: initialData.category,
        description: initialData.description || '',
        date: initialData.date,
      })
    } else {
      setForm(initialForm)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = 'Amount must be greater than 0'
    if (!form.category) newErrors.category = 'Category is required'
    if (!form.date) newErrors.date = 'Date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave(form)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>
        <div className="form-field">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-field">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Food, Rent"
          />
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>
        <div className="form-field">
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>
      </div>
      <div className="form-field">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  )
}


import { useEffect, useState } from 'react'

const initialForm = {
  category: '',
  monthly_limit: '',
}

export default function BudgetForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category,
        monthly_limit: initialData.monthly_limit,
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
    if (!form.category || form.category.trim() === '') {
      newErrors.category = 'Category is required'
    }
    if (!form.monthly_limit || Number(form.monthly_limit) <= 0) {
      newErrors.monthly_limit = 'Monthly limit must be greater than 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      monthly_limit: Number(form.monthly_limit),
    })
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Food, Rent, Entertainment"
          disabled={!!initialData}
        />
        {errors.category && <span className="error-text">{errors.category}</span>}
        {initialData && (
          <span className="info-text" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Category cannot be changed
          </span>
        )}
      </div>
      <div className="form-field">
        <label>Monthly Limit (₹)</label>
        <input
          type="number"
          name="monthly_limit"
          value={form.monthly_limit}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="5000"
        />
        {errors.monthly_limit && <span className="error-text">{errors.monthly_limit}</span>}
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

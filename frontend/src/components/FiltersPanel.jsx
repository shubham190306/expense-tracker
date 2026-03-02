import { HiAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2'

export default function FiltersPanel({ filters, onChange, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="filters-panel">
      <div className="filters-header">
        <HiAdjustmentsHorizontal /> Filters
        {hasActiveFilters && (
          <button type="button" className="btn-link btn-danger" onClick={onReset} style={{ marginLeft: 'auto', fontSize: '0.78rem' }}>
            <HiXMark /> Clear all
          </button>
        )}
      </div>
      <div className="filters-grid">
        <div className="form-field">
          <label>Type</label>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-field">
          <label>Category</label>
          <input
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="Search category..."
          />
        </div>
        <div className="form-field">
          <label>Start date</label>
          <input type="date" name="start_date" value={filters.start_date} onChange={handleChange} />
        </div>
        <div className="form-field">
          <label>End date</label>
          <input type="date" name="end_date" value={filters.end_date} onChange={handleChange} />
        </div>
      </div>
    </div>
  )
}


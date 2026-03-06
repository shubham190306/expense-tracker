import { motion } from 'framer-motion'
import { HiAdjustmentsHorizontal, HiXMark } from 'react-icons/hi2'

const panelVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function FiltersPanel({ filters, onChange, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <motion.div
      className="filters-panel"
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="filters-header">
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <HiAdjustmentsHorizontal />
        </motion.span>
        Filters
        {hasActiveFilters && (
          <motion.button
            type="button"
            className="btn-link btn-danger"
            onClick={onReset}
            style={{ marginLeft: 'auto', fontSize: '0.78rem' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiXMark /> Clear all
          </motion.button>
        )}
      </div>
      <div className="filters-grid">
        <motion.div className="form-field" variants={fieldVariants}>
          <label>Type</label>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </motion.div>
        <motion.div className="form-field" variants={fieldVariants}>
          <label>Category</label>
          <input
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="Search category..."
          />
        </motion.div>
        <motion.div className="form-field" variants={fieldVariants}>
          <label>Start date</label>
          <input type="date" name="start_date" value={filters.start_date} onChange={handleChange} />
        </motion.div>
        <motion.div className="form-field" variants={fieldVariants}>
          <label>End date</label>
          <input type="date" name="end_date" value={filters.end_date} onChange={handleChange} />
        </motion.div>
      </div>
    </motion.div>
  )
}


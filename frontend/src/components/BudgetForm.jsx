import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const initialForm = {
  category: '',
  monthly_limit: '',
}

const fieldVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 },
  }),
}

const errorVariants = {
  hidden: { opacity: 0, x: -10, height: 0 },
  visible: { opacity: 1, x: 0, height: 'auto', transition: { type: 'spring', stiffness: 400, damping: 20 } },
  exit: { opacity: 0, x: 10, height: 0, transition: { duration: 0.15 } },
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
    <motion.form
      className="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="form-field" variants={fieldVariants} initial="hidden" animate="visible" custom={0}>
        <label>Category</label>
        <motion.input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Food, Rent, Entertainment"
          disabled={!!initialData}
          whileFocus={{ borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}
        />
        <AnimatePresence>
          {errors.category && (
            <motion.span className="error-text" variants={errorVariants} initial="hidden" animate="visible" exit="exit">
              {errors.category}
            </motion.span>
          )}
        </AnimatePresence>
        {initialData && (
          <motion.span
            className="info-text"
            style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.3 }}
          >
            Category cannot be changed
          </motion.span>
        )}
      </motion.div>

      <motion.div className="form-field" variants={fieldVariants} initial="hidden" animate="visible" custom={1}>
        <label>Monthly Limit (₹)</label>
        <motion.input
          type="number"
          name="monthly_limit"
          value={form.monthly_limit}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder="5000"
          whileFocus={{ borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}
        />
        <AnimatePresence>
          {errors.monthly_limit && (
            <motion.span className="error-text" variants={errorVariants} initial="hidden" animate="visible" exit="exit">
              {errors.monthly_limit}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="form-actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          whileHover={{ scale: 1.04, backgroundColor: 'rgba(148, 163, 184, 0.1)' }}
          whileTap={{ scale: 0.96 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          className="btn-primary"
          whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Save
        </motion.button>
      </motion.div>
    </motion.form>
  )
}

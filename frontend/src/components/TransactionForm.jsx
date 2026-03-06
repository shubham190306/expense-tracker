import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const initialForm = {
  amount: '',
  type: 'expense',
  category: '',
  description: '',
  date: '',
}

const fieldVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 },
  }),
}

const errorVariants = {
  hidden: { opacity: 0, x: -10, height: 0 },
  visible: { opacity: 1, x: 0, height: 'auto', transition: { type: 'spring', stiffness: 400, damping: 20 } },
  exit: { opacity: 0, x: 10, height: 0, transition: { duration: 0.15 } },
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
    <motion.form
      className="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="form-grid">
        <motion.div className="form-field" variants={fieldVariants} initial="hidden" animate="visible" custom={0}>
          <label>Amount</label>
          <motion.input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            whileFocus={{ borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}
          />
          <AnimatePresence>
            {errors.amount && (
              <motion.span className="error-text" variants={errorVariants} initial="hidden" animate="visible" exit="exit">
                {errors.amount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="form-field" variants={fieldVariants} initial="hidden" animate="visible" custom={1}>
          <label>Type</label>
          <motion.select
            name="type"
            value={form.type}
            onChange={handleChange}
            whileFocus={{ borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </motion.select>
        </motion.div>

        <motion.div className="form-field" variants={fieldVariants} initial="hidden" animate="visible" custom={2}>
          <label>Category</label>
          <motion.input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Food, Rent"
            whileFocus={{ borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}
          />
          <AnimatePresence>
            {errors.category && (
              <motion.span className="error-text" variants={errorVariants} initial="hidden" animate="visible" exit="exit">
                {errors.category}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="form-field" variants={fieldVariants} initial="hidden" animate="visible" custom={3}>
          <label>Date</label>
          <motion.input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            whileFocus={{ borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}
          />
          <AnimatePresence>
            {errors.date && (
              <motion.span className="error-text" variants={errorVariants} initial="hidden" animate="visible" exit="exit">
                {errors.date}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div className="form-field" variants={fieldVariants} initial="hidden" animate="visible" custom={4}>
        <label>Description</label>
        <motion.textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          whileFocus={{ borderColor: 'rgba(56, 189, 248, 0.6)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}
        />
      </motion.div>

      <motion.div
        className="form-actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 20 }}
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


import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <motion.div
      className="pagination"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <motion.button
        className="btn-outline"
        disabled={prevDisabled}
        onClick={() => onPageChange(page - 1)}
        style={{ gap: '0.25rem' }}
        whileHover={!prevDisabled ? { scale: 1.05, x: -3 } : {}}
        whileTap={!prevDisabled ? { scale: 0.95 } : {}}
      >
        <HiChevronLeft /> Prev
      </motion.button>
      <AnimatePresence mode="wait">
        <motion.span
          key={page}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {page} / {totalPages}
        </motion.span>
      </AnimatePresence>
      <motion.button
        className="btn-outline"
        disabled={nextDisabled}
        onClick={() => onPageChange(page + 1)}
        style={{ gap: '0.25rem' }}
        whileHover={!nextDisabled ? { scale: 1.05, x: 3 } : {}}
        whileTap={!nextDisabled ? { scale: 0.95 } : {}}
      >
        Next <HiChevronRight />
      </motion.button>
    </motion.div>
  )
}


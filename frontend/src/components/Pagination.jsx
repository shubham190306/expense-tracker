import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <div className="pagination">
      <button
        className="btn-outline"
        disabled={prevDisabled}
        onClick={() => onPageChange(page - 1)}
        style={{ gap: '0.25rem' }}
      >
        <HiChevronLeft /> Prev
      </button>
      <span>
        {page} / {totalPages}
      </span>
      <button
        className="btn-outline"
        disabled={nextDisabled}
        onClick={() => onPageChange(page + 1)}
        style={{ gap: '0.25rem' }}
      >
        Next <HiChevronRight />
      </button>
    </div>
  )
}


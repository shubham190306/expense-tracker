import { useEffect } from 'react'
import { HiXMark } from 'react-icons/hi2'

export default function Modal({ title, open, onClose, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <HiXMark />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}


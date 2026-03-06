import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import GlowCard from '../components/GlowCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiUser, HiLockClosed, HiCheck } from 'react-icons/hi2'

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const initial = user?.username?.charAt(0)?.toUpperCase() || '?'

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      })
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
    } catch {
      toast.error('Unable to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <Navbar />
      <div className="app-main">
        <Sidebar />
        <motion.main
          className="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Settings
          </motion.h2>
          <motion.div
            className="settings-grid"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.section variants={fadeUp}>
              <GlowCard>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <HiUser style={{ color: 'var(--accent)' }} />
                  </motion.span>
                  Profile
                </h3>
                <div className="profile-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <motion.div
                      className="navbar-avatar"
                      style={{ width: 48, height: 48, fontSize: '1.1rem' }}
                      whileHover={{
                        scale: 1.15,
                        boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    >
                      {initial}
                    </motion.div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 2 }}>{user?.username}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</p>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.section>

            <motion.section variants={fadeUp}>
              <GlowCard>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <HiLockClosed style={{ color: 'var(--accent-2)' }} />
                  </motion.span>
                  Change Password
                </h3>
                <form className="form" onSubmit={handlePasswordChange}>
                  <div className="form-field">
                    <label>Current password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <motion.button
                      className="btn-primary"
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(56, 189, 248, 0.3)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {loading ? 'Saving...' : <><HiCheck /> Update password</>}
                    </motion.button>
                  </div>
                </form>
              </GlowCard>
            </motion.section>
          </motion.div>
        </motion.main>
      </div>
    </div>
  )
}


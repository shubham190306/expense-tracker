import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiUser, HiLockClosed, HiCheck } from 'react-icons/hi2'

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
        <main className="content">
          <h2>Settings</h2>
          <div className="settings-grid">
            <section className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiUser style={{ color: 'var(--accent)' }} /> Profile
              </h3>
              <div className="profile-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <div className="navbar-avatar" style={{ width: 48, height: 48, fontSize: '1.1rem' }}>{initial}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 2 }}>{user?.username}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.email}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiLockClosed style={{ color: 'var(--accent-2)' }} /> Change Password
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
                  <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : <><HiCheck /> Update password</>}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}


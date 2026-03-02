import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { TbWallet } from 'react-icons/tb'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const access = searchParams.get('access')
    const refresh = searchParams.get('refresh')
    const error = searchParams.get('error')

    if (error) {
      navigate(`/login?error=${error}`, { replace: true })
      return
    }

    if (!access || !refresh) {
      navigate('/login', { replace: true })
      return
    }

    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
    api.get('/me/')
      .then((res) => {
        window.dispatchEvent(new CustomEvent('auth-tokens-set', { detail: res.data }))
        navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/login?error=session', { replace: true })
      })
  }, [searchParams, navigate])

  return (
    <div className="layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', animation: 'fadeIn 0.3s ease' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Signing you in...</p>
      </div>
    </div>
  )
}

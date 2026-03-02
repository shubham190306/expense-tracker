import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { FcGoogle } from 'react-icons/fc'
import { HiArrowRight } from 'react-icons/hi2'

const GOOGLE_LOGIN_URL = `${api.defaults.baseURL}/auth/google/`

export default function LoginPage() {
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const err = searchParams.get('error')
    if (err === 'google_config') setError('Google login is not configured.')
    else if (err === 'google_token' || err === 'google_userinfo') setError('Google sign-in failed. Try again.')
    else if (err === 'google_no_email') setError('Could not get email from Google.')
    else if (err === 'session') setError('Session invalid. Please log in again.')
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="auth-main">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Log in to your account to continue</p>
          <a href={GOOGLE_LOGIN_URL} className="btn-google">
            <FcGoogle size={20} />
            Continue with Google
          </a>
          <div className="auth-divider">or</div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Email or username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Logging in...</>
              ) : (
                <>Log in <HiArrowRight /></>
              )}
            </button>
          </form>
          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  )
}


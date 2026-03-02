import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { FcGoogle } from 'react-icons/fc'
import { HiArrowRight } from 'react-icons/hi2'

const GOOGLE_LOGIN_URL = `${api.defaults.baseURL}/auth/google/`

export default function SignupPage() {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, email, password)
    } catch (err) {
      setError('Unable to sign up. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="auth-main">
        <div className="auth-card">
          <h2>Create your account</h2>
          <p className="auth-subtitle">Start tracking your expenses in seconds</p>
          <a href={GOOGLE_LOGIN_URL} className="btn-google">
            <FcGoogle size={20} />
            Sign up with Google
          </a>
          <div className="auth-divider">or</div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                required
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</>
              ) : (
                <>Create account <HiArrowRight /></>
              )}
            </button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}


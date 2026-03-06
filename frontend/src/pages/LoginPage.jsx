import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { FcGoogle } from 'react-icons/fc'
import { HiArrowRight } from 'react-icons/hi2'

const GOOGLE_LOGIN_URL = `${api.defaults.baseURL}/auth/google/`

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 20,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

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
        {/* Background floating orbs */}
        <motion.div
          style={{
            position: 'absolute', top: '20%', left: '15%', width: 200, height: 200,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }}
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute', bottom: '20%', right: '15%', width: 250, height: 250,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.06), transparent 70%)',
            filter: 'blur(50px)', pointerEvents: 'none',
          }}
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <motion.div
          className="auth-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants}>Welcome back</motion.h2>
          <motion.p className="auth-subtitle" variants={itemVariants}>Log in to your account to continue</motion.p>
          <motion.a
            href={GOOGLE_LOGIN_URL}
            className="btn-google"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <FcGoogle size={20} />
            Continue with Google
          </motion.a>
          <motion.div className="auth-divider" variants={itemVariants}>or</motion.div>
          <motion.form className="form" onSubmit={handleSubmit} variants={itemVariants}>
            <motion.div className="form-field" variants={itemVariants}>
              <label>Email or username</label>
              <motion.input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                whileFocus={{ borderColor: '#38bdf8', boxShadow: '0 0 0 3px rgba(56, 189, 248, 0.15)' }}
              />
            </motion.div>
            <motion.div className="form-field" variants={itemVariants}>
              <label>Password</label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                whileFocus={{ borderColor: '#38bdf8', boxShadow: '0 0 0 3px rgba(56, 189, 248, 0.15)' }}
              />
            </motion.div>
            {error && (
              <motion.p
                className="error-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {error}
              </motion.p>
            )}
            <motion.button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(56, 189, 248, 0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Logging in...</>
              ) : (
                <>Log in <HiArrowRight /></>
              )}
            </motion.button>
          </motion.form>
          <motion.p className="auth-footer" variants={itemVariants}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  )
}


import { useState } from 'react'
import { Link } from 'react-router-dom'
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
        {/* Background floating orbs */}
        <motion.div
          style={{
            position: 'absolute', top: '15%', right: '20%', width: 220, height: 220,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }}
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute', bottom: '25%', left: '10%', width: 180, height: 180,
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.06), transparent 70%)',
            filter: 'blur(35px)', pointerEvents: 'none',
          }}
          animate={{ y: [0, 12, 0], x: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />

        <motion.div
          className="auth-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants}>Create your account</motion.h2>
          <motion.p className="auth-subtitle" variants={itemVariants}>Start tracking your expenses in seconds</motion.p>
          <motion.a
            href={GOOGLE_LOGIN_URL}
            className="btn-google"
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <FcGoogle size={20} />
            Sign up with Google
          </motion.a>
          <motion.div className="auth-divider" variants={itemVariants}>or</motion.div>
          <motion.form className="form" onSubmit={handleSubmit} variants={itemVariants}>
            <motion.div className="form-field" variants={itemVariants}>
              <label>Username</label>
              <motion.input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                required
                autoFocus
                whileFocus={{ borderColor: '#38bdf8', boxShadow: '0 0 0 3px rgba(56, 189, 248, 0.15)' }}
              />
            </motion.div>
            <motion.div className="form-field" variants={itemVariants}>
              <label>Email</label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                whileFocus={{ borderColor: '#38bdf8', boxShadow: '0 0 0 3px rgba(56, 189, 248, 0.15)' }}
              />
            </motion.div>
            <motion.div className="form-field" variants={itemVariants}>
              <label>Password</label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
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
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</>
              ) : (
                <>Create account <HiArrowRight /></>
              )}
            </motion.button>
          </motion.form>
          <motion.p className="auth-footer" variants={itemVariants}>
            Already have an account? <Link to="/login">Log in</Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  )
}


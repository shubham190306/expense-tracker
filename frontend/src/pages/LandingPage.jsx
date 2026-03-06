import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import ParticleBackground from '../components/ParticleBackground'
import { HiArrowRight, HiChartBar, HiShieldCheck } from 'react-icons/hi2'
import { TbWallet, TbTargetArrow, TbReportAnalytics, TbRocket, TbSparkles } from 'react-icons/tb'
import api from '../services/api'

const GOOGLE_LOGIN_URL = `${api.defaults.baseURL}/auth/google/`

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const heroChild = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

const featureVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const featureCard = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const floatingOrb = (delay = 0) => ({
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
      delay,
    },
  },
})

export default function LandingPage() {
  return (
    <div className="layout">
      <ParticleBackground />
      <Navbar />
      <main className="landing-main">
        {/* Floating gradient orbs */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
          {...floatingOrb(0)}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
          {...floatingOrb(2)}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
          }}
          {...floatingOrb(4)}
        />

        <motion.section
          className="hero"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={heroChild}>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <TbSparkles size={16} />
            </motion.span>
            Smart money management
            <motion.span
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <TbRocket size={16} />
            </motion.span>
          </motion.div>

          <motion.h1 variants={heroChild}>
            Track expenses.<br />
            <motion.span
              className="gradient-text"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              Own your money.
            </motion.span>
          </motion.h1>

          <motion.p variants={heroChild}>
            Record income and expenses, visualize your cash flow, and stay on top
            of your budgets — all from a single, beautifully crafted dashboard.
          </motion.p>

          <motion.div className="hero-actions" variants={heroChild}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to="/signup" className="btn-primary">
                Get started free <HiArrowRight />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <a href={GOOGLE_LOGIN_URL} className="btn-outline">
                Sign in with Google
              </a>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to="/login" className="btn-ghost" style={{ color: 'var(--text-secondary)' }}>
                Already have an account?
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated stats bar */}
          <motion.div
            variants={heroChild}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-8)',
              marginTop: 'var(--space-10)',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '₹50Cr+', label: 'Tracked' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="features-section"
          variants={featureVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <div className="features-grid">
            {[
              {
                icon: <TbReportAnalytics size={24} />,
                color: 'blue',
                title: 'Real-time Analytics',
                desc: 'Visualize your spending with beautiful charts. Track monthly trends and category breakdowns at a glance.',
              },
              {
                icon: <TbTargetArrow size={24} />,
                color: 'purple',
                title: 'Smart Budgets',
                desc: 'Set category-based budgets and get alerts when you\'re close to the limit. Stay in control effortlessly.',
              },
              {
                icon: <HiShieldCheck size={24} />,
                color: 'green',
                title: 'Secure & Private',
                desc: 'Your financial data stays yours. Secure authentication with JWT tokens and Google OAuth support.',
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                variants={featureCard}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  borderColor: 'rgba(99, 117, 175, 0.35)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(56, 189, 248, 0.08)',
                  transition: { type: 'spring', stiffness: 300, damping: 20 },
                }}
              >
                <motion.div
                  className={`feature-icon ${feature.color}`}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}


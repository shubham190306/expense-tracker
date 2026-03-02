import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { HiArrowRight, HiChartBar, HiShieldCheck } from 'react-icons/hi2'
import { TbWallet, TbTargetArrow, TbReportAnalytics } from 'react-icons/tb'
import api from '../services/api'

const GOOGLE_LOGIN_URL = `${api.defaults.baseURL}/auth/google/`

export default function LandingPage() {
  return (
    <div className="layout">
      <Navbar />
      <main className="landing-main">
        <section className="hero">
          <div className="hero-badge">
            <TbWallet size={16} />
            Smart money management
          </div>
          <h1>
            Track expenses.<br />
            <span className="gradient-text">Own your money.</span>
          </h1>
          <p>
            Record income and expenses, visualize your cash flow, and stay on top
            of your budgets — all from a single, beautifully crafted dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">
              Get started free <HiArrowRight />
            </Link>
            <a href={GOOGLE_LOGIN_URL} className="btn-outline">
              Sign in with Google
            </a>
            <Link to="/login" className="btn-ghost" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?
            </Link>
          </div>
        </section>

        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue"><TbReportAnalytics size={24} /></div>
              <h3>Real-time Analytics</h3>
              <p>Visualize your spending with beautiful charts. Track monthly trends and category breakdowns at a glance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon purple"><TbTargetArrow size={24} /></div>
              <h3>Smart Budgets</h3>
              <p>Set category-based budgets and get alerts when you're close to the limit. Stay in control effortlessly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon green"><HiShieldCheck size={24} /></div>
              <h3>Secure & Private</h3>
              <p>Your financial data stays yours. Secure authentication with JWT tokens and Google OAuth support.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}


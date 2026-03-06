import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { RiDashboardLine, RiExchangeDollarLine, RiSettings3Line } from 'react-icons/ri'
import { TbWallet } from 'react-icons/tb'

const navVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
}

const logoVariants = {
  hidden: { x: -30, opacity: 0, scale: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  const initial = user?.username?.charAt(0)?.toUpperCase() || '?'

  return (
    <motion.header
      className="navbar"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <motion.span
            className="navbar-logo-icon"
            variants={logoVariants}
            whileHover={{
              rotate: [0, -10, 10, -5, 5, 0],
              scale: 1.15,
              transition: { duration: 0.6 },
            }}
            whileTap={{ scale: 0.9 }}
          >
            <TbWallet />
          </motion.span>
          <motion.span variants={itemVariants}>ExpenseTracker</motion.span>
        </Link>
      </div>
      <nav className="navbar-right">
        {isAuthenticated ? (
          <>
            {[
              { to: '/dashboard', icon: <RiDashboardLine />, label: 'Dashboard' },
              { to: '/transactions', icon: <RiExchangeDollarLine />, label: 'Transactions' },
              { to: '/settings', icon: <RiSettings3Line />, label: 'Settings' },
            ].map((link) => (
              <motion.div key={link.to} variants={itemVariants}>
                <Link to={link.to} className="navbar-link">
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {link.icon}
                  </motion.span>
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              className="navbar-user"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <motion.span
                className="navbar-avatar"
                whileHover={{
                  scale: 1.2,
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {initial}
              </motion.span>
              {user?.username}
            </motion.div>
            <motion.button
              onClick={logout}
              className="btn-ghost"
              title="Logout"
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                color: '#f87171',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <HiOutlineArrowRightOnRectangle size={18} />
            </motion.button>
          </>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <Link to="/login" className="btn-outline">
                Log in
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link to="/signup" className="btn-primary">
                Sign up
              </Link>
            </motion.div>
          </>
        )}
      </nav>
    </motion.header>
  )
}


import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiDashboardLine, RiExchangeDollarLine, RiSettings3Line } from 'react-icons/ri'
import { HiOutlineChartPie } from 'react-icons/hi2'

const sidebarVariants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
}

const linkVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
}

const links = [
  { to: '/dashboard', icon: <RiDashboardLine />, label: 'Dashboard', section: 'Menu' },
  { to: '/transactions', icon: <RiExchangeDollarLine />, label: 'Transactions' },
  { to: '/budgets', icon: <HiOutlineChartPie />, label: 'Budgets' },
  { to: '/settings', icon: <RiSettings3Line />, label: 'Settings', section: 'Account' },
]

export default function Sidebar() {
  let lastSection = ''

  return (
    <motion.aside
      className="sidebar"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {links.map((link) => {
        const showSection = link.section && link.section !== lastSection
        if (link.section) lastSection = link.section

        return (
          <motion.div key={link.to} variants={linkVariants}>
            {showSection && (
              <motion.span
                className="sidebar-section-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {link.section}
              </motion.span>
            )}
            <NavLink to={link.to} className="sidebar-link">
              {({ isActive }) => (
                <>
                  <motion.span
                    className="sidebar-icon"
                    whileHover={{ scale: 1.25, rotate: 5 }}
                    animate={isActive ? {
                      scale: [1, 1.2, 1],
                      transition: { duration: 0.4 },
                    } : {}}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {link.icon}
                  </motion.span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 20,
                        borderRadius: '0 999px 999px 0',
                        background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        )
      })}
    </motion.aside>
  )
}


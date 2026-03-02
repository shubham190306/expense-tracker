import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { RiDashboardLine, RiExchangeDollarLine, RiSettings3Line } from 'react-icons/ri'
import { TbWallet } from 'react-icons/tb'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  const initial = user?.username?.charAt(0)?.toUpperCase() || '?'

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon"><TbWallet /></span>
          ExpenseTracker
        </Link>
      </div>
      <nav className="navbar-right">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="navbar-link">
              <RiDashboardLine /> <span>Dashboard</span>
            </Link>
            <Link to="/transactions" className="navbar-link">
              <RiExchangeDollarLine /> <span>Transactions</span>
            </Link>
            <Link to="/settings" className="navbar-link">
              <RiSettings3Line /> <span>Settings</span>
            </Link>
            <div className="navbar-user">
              <span className="navbar-avatar">{initial}</span>
              {user?.username}
            </div>
            <button onClick={logout} className="btn-ghost" title="Logout">
              <HiOutlineArrowRightOnRectangle size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}


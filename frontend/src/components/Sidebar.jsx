import { NavLink } from 'react-router-dom'
import { RiDashboardLine, RiExchangeDollarLine, RiSettings3Line } from 'react-icons/ri'
import { HiOutlineChartPie } from 'react-icons/hi2'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <span className="sidebar-section-label">Menu</span>
      <NavLink to="/dashboard" className="sidebar-link">
        <span className="sidebar-icon"><RiDashboardLine /></span>
        Dashboard
      </NavLink>
      <NavLink to="/transactions" className="sidebar-link">
        <span className="sidebar-icon"><RiExchangeDollarLine /></span>
        Transactions
      </NavLink>
      <NavLink to="/budgets" className="sidebar-link">
        <span className="sidebar-icon"><HiOutlineChartPie /></span>
        Budgets
      </NavLink>
      <span className="sidebar-section-label">Account</span>
      <NavLink to="/settings" className="sidebar-link">
        <span className="sidebar-icon"><RiSettings3Line /></span>
        Settings
      </NavLink>
    </aside>
  )
}


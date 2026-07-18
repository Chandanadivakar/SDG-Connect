import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Building2, CalendarDays, Home, LayoutDashboard, Mail, Users } from 'lucide-react'
import { getActiveUser, setActiveUserKind } from '../lib/store'
import { LogoMark } from './LogoMark'

function LinkItem({
  to,
  icon,
  label,
}: {
  to: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'nav-item' + (isActive ? ' nav-item-active' : '')
      }
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

export function AppLayout() {
  const location = useLocation()
  const user = getActiveUser()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div style={{ flex: '0 0 auto' }}>
            <LogoMark size={50} />
          </div>
          <div>
            <div className="brand-title">SDG : CONNECT</div>
            <div className="brand-sub">South India Collaboration Hub</div>
          </div>
        </div>

        <div className="card soft">
          <div className="muted tiny">Active mode</div>
          <div className="row gap-sm" style={{ marginTop: 8 }}>
            <button
              className={'pill' + (user.kind === 'NGO' ? ' pill-active' : '')}
              onClick={() => setActiveUserKind('NGO')}
              type="button"
            >
              NGO
            </button>
            <button
              className={
                'pill' + (user.kind === 'COMPANY' ? ' pill-active' : '')
              }
              onClick={() => setActiveUserKind('COMPANY')}
              type="button"
            >
              Company
            </button>
          </div>
          <div className="muted tiny" style={{ marginTop: 10 }}>
            Signed in as <b>{user.name}</b>
          </div>
        </div>

        <nav className="nav">
          <LinkItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <LinkItem to="/ngo-hub" icon={<Users size={18} />} label="NGO Hub" />
          <LinkItem to="/ngo-events" icon={<CalendarDays size={18} />} label="NGO Events" />
          <LinkItem to="/company-hub" icon={<Building2 size={18} />} label="Company Hub" />
          <LinkItem to="/bulk-email" icon={<Mail size={18} />} label="Bulk Email" />
          <LinkItem to="/" icon={<Home size={18} />} label="Back to Landing" />
        </nav>

        <div className="sidebar-footer muted tiny">
          {location.pathname}
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-title">Smart Collaboration Platform For Sustainable Development</div>
          <div className="topbar-right muted tiny">
            APIs • cloud-ready • dashboards • resource sharing
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}


import { Link } from 'react-router-dom'
import { ensureSeedData } from '../lib/store'
import { LogoMark } from '../components/LogoMark'

export function Landing() {
  ensureSeedData()

  return (
    <div style={{ padding: 22, maxWidth: 1100, margin: '0 auto' }}>
      <div className="card">
        <div className="row gap-md" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="row gap-sm" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <LogoMark size={34} />
              <div className="tag">SDG : CONNECT</div>
            </div>
            <h1 style={{ margin: '12px 0 6px', fontSize: 44, lineHeight: 1.1 }}>
              Interoperable SDG collaboration hub
            </h1>
            <div className="muted" style={{ maxWidth: 760 }}>
              A collaboration frontend for NGOs, companies/startups, and agencies to coordinate initiatives, share
              resources, and track progress via dashboards and messaging.
            </div>
            <div className="row gap-sm" style={{ marginTop: 14, flexWrap: 'wrap' }}>
              <span className="tag">NGO-only network</span>
              <span className="tag">NGO ↔ Company hub</span>
              <span className="tag">Bulk email + AI drafting</span>
              <span className="tag">Cloud/API ready</span>
            </div>
          </div>
          <div className="card soft" style={{ minWidth: 300 }}>
            <div style={{ fontWeight: 700 }}>Quick start</div>
            <div className="muted tiny" style={{ marginTop: 6 }}>
              Demo uses mock data + localStorage. No backend needed.
            </div>
            <div className="row gap-sm" style={{ marginTop: 12, flexWrap: 'wrap' }}>
              <Link className="btn primary" to="/dashboard">
                Enter app
              </Link>
              <Link className="btn" to="/bulk-email">
                Bulk email
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 14 }}>
        <div className="card">
          <div style={{ fontWeight: 700 }}>Dashboard</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Snapshot of SDG focus areas, active connections, and message activity.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn" to="/dashboard">
              Open dashboard
            </Link>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700 }}>NGO Hub (NGO-only)</div>
          <div className="muted" style={{ marginTop: 6 }}>
            NGOs discover and connect only with other NGOs, then message privately.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn" to="/ngo-hub">
              Open NGO hub
            </Link>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700 }}>Company Hub</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Directory + messaging between NGOs and companies/startups for pilots and CSR.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="btn" to="/company-hub">
              Open company hub
            </Link>
          </div>
        </div>
      </div>

      <div className="muted tiny" style={{ marginTop: 14, paddingBottom: 10 }}>
        Tip: Switch “Active mode” (NGO/Company) in the sidebar to see both sides of messaging.
      </div>
    </div>
  )
}


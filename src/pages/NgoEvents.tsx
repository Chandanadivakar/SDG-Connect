import { useEffect, useMemo, useState } from 'react'
import { getActiveUser, getEntities, getNgoEvents } from '../lib/store'

function formatInr(n?: number) {
  if (!n) return '—'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export function NgoEvents() {
  const [tick, setTick] = useState(0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onAny = () => setTick((t) => t + 1)
    window.addEventListener('sdgconnect:activeUser', onAny)
    window.addEventListener('sdgconnect:entities', onAny)
    return () => {
      window.removeEventListener('sdgconnect:activeUser', onAny)
      window.removeEventListener('sdgconnect:entities', onAny)
    }
  }, [])

  const user = useMemo(() => getActiveUser(), [tick])
  const entities = useMemo(() => getEntities(), [tick])
  const events = useMemo(() => getNgoEvents(), [tick])

  const ngos = entities.filter((e) => e.kind === 'NGO')
  const me = entities.find((e) => e.id === user.entityId)

  const filtered = events
    .filter((ev) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      const org = ngos.find((n) => n.id === ev.organizerNgoId)
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.city.toLowerCase().includes(q) ||
        ev.state.toLowerCase().includes(q) ||
        ev.sdgs.some((s) => s.toLowerCase().includes(q)) ||
        (org?.name.toLowerCase().includes(q) ?? false)
      )
    })
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))

  return (
    <div className="grid-2">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="tag">NGO Events</div>
            <div style={{ fontWeight: 900, fontSize: 18, marginTop: 6 }}>
              Reference events for NGOs to join • Visible to companies for funding
            </div>
            <div className="muted tiny" style={{ marginTop: 6 }}>
              NGOs can join events; Companies can fund events via email to the organizer.
            </div>
          </div>
          <div style={{ minWidth: 280 }}>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by event, city, SDG, organizer…"
            />
          </div>
        </div>

        <div className="list" style={{ marginTop: 14 }}>
          {filtered.map((ev) => {
            const org = ngos.find((n) => n.id === ev.organizerNgoId)
            const date = new Date(ev.dateISO)
            const to = org?.email ?? ''
            const subject = encodeURIComponent(`Funding / Participation: ${ev.title}`)
            const body = encodeURIComponent(
              `Hello ${org?.name ?? 'Team'},\n\n` +
                `I’m reaching out regarding your event: "${ev.title}" on ${date.toLocaleString()} at ${ev.venue}, ${ev.city}.\n\n` +
                (user.kind === 'COMPANY'
                  ? `We are interested in sponsoring/funding this event. Please share budget breakdown and sponsorship options.\n`
                  : `We are interested in joining/supporting this event as an NGO partner. Please share participation details.\n`) +
                `\nRegards,\n${me?.name ?? '—'}\n`,
            )
            const mailto = `mailto:${to}?subject=${subject}&body=${body}`

            return (
              <div key={ev.id} className="card soft">
                <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
                      <span className="tag">
                        {ev.city}, {ev.state}
                      </span>
                      <span className="tag">{date.toLocaleDateString()}</span>
                      {ev.sdgs.slice(0, 3).map((s) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontWeight: 900, marginTop: 8 }}>{ev.title}</div>
                    <div className="muted tiny" style={{ marginTop: 6 }}>
                      Organizer: <b style={{ color: 'var(--text)' }}>{org?.name ?? ev.organizerNgoId}</b>
                      {org?.website ? (
                        <>
                          {' '}
                          •{' '}
                          <a href={org.website} target="_blank" rel="noreferrer">
                            Website
                          </a>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="row gap-sm" style={{ alignItems: 'start', flexWrap: 'wrap' }}>
                    <a className="btn" href={mailto}>
                      {user.kind === 'COMPANY' ? 'Fund this event (Mail)' : 'Join event (Mail)'}
                    </a>
                  </div>
                </div>

                <div className="muted" style={{ marginTop: 10 }}>
                  {ev.summary}
                </div>

                <div className="grid-3" style={{ marginTop: 12 }}>
                  <div className="card soft">
                    <div className="muted tiny">Venue</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{ev.venue}</div>
                  </div>
                  <div className="card soft">
                    <div className="muted tiny">Volunteers needed</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{ev.volunteersNeeded ?? '—'}</div>
                  </div>
                  <div className="card soft">
                    <div className="muted tiny">Funding target</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{formatInr(ev.fundingTargetINR)}</div>
                  </div>
                </div>

                {ev.sponsorNotes ? (
                  <div className="muted tiny" style={{ marginTop: 10 }}>
                    <b style={{ color: 'var(--text)' }}>Sponsor notes:</b> {ev.sponsorNotes}
                  </div>
                ) : null}
              </div>
            )
          })}

          {filtered.length === 0 ? <div className="muted tiny">No events match your search.</div> : null}
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 900 }}>How companies can fund</div>
        <div className="muted" style={{ marginTop: 8 }}>
          Open any event and click <b>Fund this event (Mail)</b>. It will open your system’s default email app with a
          pre-filled message to the organizer NGO.
        </div>
        <div className="card soft" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800 }}>Suggested sponsorship tiers</div>
          <ul className="muted" style={{ marginTop: 10, paddingLeft: 18 }}>
            <li>₹25,000 – Materials / kits</li>
            <li>₹50,000 – Venue + outreach + logistics</li>
            <li>₹1,00,000+ – Full event sponsorship + reporting dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


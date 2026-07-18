import { useEffect, useMemo, useState } from 'react'
import { EntityCard } from '../components/EntityCard'
import { ChatPanel } from '../components/ChatPanel'
import { addConnection, getActiveUser, getConnections, getEntities } from '../lib/store'

export function CompanyHub() {
  const [tick, setTick] = useState(0)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const onAny = () => setTick((t) => t + 1)
    window.addEventListener('sdgconnect:activeUser', onAny)
    window.addEventListener('sdgconnect:connections', onAny)
    window.addEventListener('sdgconnect:messages', onAny)
    return () => {
      window.removeEventListener('sdgconnect:activeUser', onAny)
      window.removeEventListener('sdgconnect:connections', onAny)
      window.removeEventListener('sdgconnect:messages', onAny)
    }
  }, [])

  const user = useMemo(() => getActiveUser(), [tick])
  const entities = useMemo(() => getEntities(), [tick])
  const conns = useMemo(() => getConnections(), [tick])

  const me = entities.find((e) => e.id === user.entityId)
  const others = entities.filter((e) => e.id !== user.entityId)

  const filtered = others.filter((e) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      e.name.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      e.state.toLowerCase().includes(q) ||
      e.focus.some((s) => s.toLowerCase().includes(q)) ||
      e.kind.toLowerCase().includes(q)
    )
  })

  const selected = entities.find((e) => e.id === selectedId) ?? null

  if (!me) return null

  return (
    <div className="split">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="tag">NGO ↔ Company hub</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 6 }}>
              Directory + messaging between NGOs and companies
            </div>
            <div className="muted tiny" style={{ marginTop: 6 }}>
              In Company mode, you can also message NGOs. In NGO mode, message companies.
            </div>
          </div>
          <div style={{ minWidth: 260 }}>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by org, city, SDG, kind…"
            />
          </div>
        </div>

        <div className="list" style={{ marginTop: 14 }}>
          {filtered.map((e) => {
            const isConnected = conns.some((c) => c.fromId === me.id && c.toId === e.id)
            const isCompany = e.kind === 'COMPANY'
            return (
              <EntityCard
                key={e.id}
                entity={e}
                showFocusTags={false}
                actions={
                  <>
                    <button className="btn" type="button" onClick={() => setSelectedId(e.id)}>
                      Message
                    </button>
                    {isCompany ? (
                      <button
                        className="btn"
                        type="button"
                        onClick={() => {
                          window.location.href = `mailto:${e.email}`
                        }}
                      >
                        Mail
                      </button>
                    ) : null}
                    <button
                      className={'btn ' + (isConnected ? '' : 'primary')}
                      type="button"
                      onClick={() => addConnection(me.id, e.id)}
                      disabled={isConnected}
                      title={isConnected ? 'Already connected' : 'Connect'}
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </>
                }
              />
            )
          })}
        </div>
      </div>

      {selected ? (
        <ChatPanel me={me} other={selected} />
      ) : (
        <div className="card">
          <div style={{ fontWeight: 800 }}>Messaging</div>
          <div className="muted tiny" style={{ marginTop: 8 }}>
            Select an organization and click “Message” to start chatting.
          </div>
        </div>
      )}
    </div>
  )
}


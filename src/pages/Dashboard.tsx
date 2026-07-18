import { useEffect, useMemo, useState } from 'react'
import { addEntity, getActiveUser, getConnections, getEntities, getMessages } from '../lib/store'
import type { Entity, Sdgs } from '../lib/types'
import { SDG_INFO } from '../lib/sdgs'
import { EntityCard } from '../components/EntityCard'

function countSdgs(entities: Entity[]) {
  const map = new Map<string, number>()
  for (const e of entities) {
    for (const sdg of e.focus) map.set(sdg, (map.get(sdg) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
}

export function Dashboard() {
  const [tick, setTick] = useState(0)
  const [selectedSdg, setSelectedSdg] = useState<string | null>(null)
  const [modalView, setModalView] = useState<'full' | 'orgs'>('full')
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null)
  const [newOrg, setNewOrg] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    state: 'KA' as Entity['state'],
    about: '',
    focus: 'SDG 17' as Sdgs,
  })

  useEffect(() => {
    const onAny = () => setTick((t) => t + 1)
    window.addEventListener('sdgconnect:activeUser', onAny)
    window.addEventListener('sdgconnect:connections', onAny)
    window.addEventListener('sdgconnect:messages', onAny)
    window.addEventListener('sdgconnect:entities', onAny)
    return () => {
      window.removeEventListener('sdgconnect:activeUser', onAny)
      window.removeEventListener('sdgconnect:connections', onAny)
      window.removeEventListener('sdgconnect:messages', onAny)
      window.removeEventListener('sdgconnect:entities', onAny)
    }
  }, [])

  const user = useMemo(() => getActiveUser(), [tick])
  const entities = useMemo(() => getEntities(), [tick])
  const conns = useMemo(() => getConnections(), [tick])
  const msgs = useMemo(() => getMessages(), [tick])

  const me = entities.find((e) => e.id === user.entityId)
  const companies = entities.filter((e) => e.kind === 'COMPANY')
  const ngos = entities.filter((e) => e.kind === 'NGO')

  const sdgTop = countSdgs(ngos)
  const myConnCount = conns.filter((c) => c.fromId === user.entityId).length
  const myMsgCount = msgs.filter((m) => m.fromId === user.entityId || m.toId === user.entityId).length

  const selectedInfo = selectedSdg ? SDG_INFO[selectedSdg] : undefined
  const ngosForSelected = selectedSdg
    ? ngos.filter((n) => n.focus.includes(selectedSdg as any))
    : []
  const selectedNgo =
    ngosForSelected.find((n) => n.id === selectedNgoId) ?? ngosForSelected[0] ?? null

  return (
    <div className="grid-2">
      <div className="card">
        <div className="row gap-md" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="tag">Progress dashboard</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginTop: 8 }}>Welcome, {me?.name}</div>
            <div className="muted" style={{ marginTop: 6 }}>
              Mode: <b>{user.kind}</b> • Location: {me?.city}, {me?.state}
            </div>
          </div>
          <div className="row gap-sm">
            <div className="card soft">
              <div className="muted tiny">Your connections</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{myConnCount}</div>
            </div>
            <div className="card soft">
              <div className="muted tiny">Your messages</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{myMsgCount}</div>
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 14 }}>
          <div className="card soft">
            <div className="muted tiny">Total NGOs</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{ngos.length}</div>
          </div>
          <div className="card soft">
            <div className="muted tiny">Total Companies</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{companies.length}</div>
          </div>
          <div className="card soft">
            <div className="muted tiny">Active conversations</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>
              {new Set(msgs.map((m) => m.threadId)).size}
            </div>
          </div>
        </div>

        <div className="card soft" style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 800 }}>Add New NGO</div>
          <div className="muted tiny" style={{ marginTop: 6 }}>
            Create a new NGO profile. It appears immediately in hubs and directories.
          </div>
          <div className="grid-3" style={{ marginTop: 10 }}>
            <div>
              <div className="muted tiny">Name</div>
              <input
                className="input"
                value={newOrg.name}
                onChange={(e) => setNewOrg((p) => ({ ...p, name: e.target.value }))}
                placeholder="Organization name"
              />
            </div>
            <div>
              <div className="muted tiny">Email</div>
              <input
                className="input"
                value={newOrg.email}
                onChange={(e) => setNewOrg((p) => ({ ...p, email: e.target.value }))}
                placeholder="official@email.org"
              />
            </div>
          </div>
          <div className="grid-3" style={{ marginTop: 10 }}>
            <div>
              <div className="muted tiny">Phone</div>
              <input
                className="input"
                value={newOrg.phone}
                onChange={(e) => setNewOrg((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 ..."
              />
            </div>
            <div>
              <div className="muted tiny">Website</div>
              <input
                className="input"
                value={newOrg.website}
                onChange={(e) => setNewOrg((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <div className="muted tiny">SDG Focus</div>
              <select
                className="select"
                value={newOrg.focus}
                onChange={(e) => setNewOrg((p) => ({ ...p, focus: e.target.value as Sdgs }))}
              >
                {Array.from({ length: 17 }, (_, i) => `SDG ${i + 1}`).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid-3" style={{ marginTop: 10 }}>
            <div>
              <div className="muted tiny">State</div>
              <select
                className="select"
                value={newOrg.state}
                onChange={(e) => setNewOrg((p) => ({ ...p, state: e.target.value as Entity['state'] }))}
              >
                <option value="KA">KA</option>
                <option value="TN">TN</option>
                <option value="KL">KL</option>
                <option value="AP">AP</option>
                <option value="TG">TG</option>
              </select>
            </div>
            <div>
              <div className="muted tiny">City</div>
              <input
                className="input"
                value={newOrg.city}
                onChange={(e) => setNewOrg((p) => ({ ...p, city: e.target.value }))}
                placeholder="City"
              />
            </div>
            <div>
              <div className="muted tiny">About</div>
              <input
                className="input"
                value={newOrg.about}
                onChange={(e) => setNewOrg((p) => ({ ...p, about: e.target.value }))}
                placeholder="Short profile"
              />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              className="btn primary"
              type="button"
              onClick={() => {
                if (!newOrg.name.trim() || !newOrg.email.trim() || !newOrg.city.trim() || !newOrg.about.trim()) {
                  return
                }
                addEntity({
                  kind: 'NGO',
                  name: newOrg.name.trim(),
                  email: newOrg.email.trim(),
                  phone: newOrg.phone.trim() || undefined,
                  website: newOrg.website.trim() || undefined,
                  state: newOrg.state,
                  city: newOrg.city.trim(),
                  focus: [newOrg.focus],
                  about: newOrg.about.trim(),
                  resourcesOffered: [],
                  resourcesNeeded: [],
                })
                setNewOrg({
                  name: '',
                  email: '',
                  phone: '',
                  website: '',
                  city: '',
                  state: 'KA',
                  about: '',
                  focus: 'SDG 17',
                })
              }}
            >
              Add organization
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 800, fontSize: 16 }}>Top SDG focus areas</div>
        <div className="muted tiny" style={{ marginTop: 6 }}>
          Click an SDG to view details and matching NGOs.
        </div>
        <div className="list" style={{ marginTop: 12 }}>
          {sdgTop.map(([sdg, n]) => (
            <div key={sdg} className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
              <button
                type="button"
                className="tag clickable"
                onClick={() => {
                  setSelectedSdg(sdg)
                  setModalView('full')
                  setSelectedNgoId(null)
                }}
                aria-label={`Open details for ${sdg}`}
              >
                {sdg}
              </button>
              <button
                type="button"
                className="tag clickable"
                onClick={() => {
                  setSelectedSdg(sdg)
                  setModalView('orgs')
                  setSelectedNgoId(null)
                }}
                aria-label={`Show organizations for ${sdg}`}
              >
                <b style={{ color: 'var(--text)' }}>{n}</b>&nbsp;orgs
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedSdg ? (
        <div
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-label="SDG details"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedSdg(null)
          }}
        >
          <div className="modal">
            <div className="modal-inner">
              <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
                    <span className="tag">{selectedSdg}</span>
                    <span className="tag">NGOs: {ngosForSelected.length}</span>
                  </div>
                  {modalView === 'full' ? (
                    <>
                      <div style={{ fontWeight: 900, fontSize: 20, marginTop: 8 }}>
                        {selectedInfo?.title ?? 'SDG details'}
                      </div>
                      <div className="muted" style={{ marginTop: 8 }}>
                        {selectedInfo?.summary ??
                          'Details for this SDG are not configured yet. Add a description in src/lib/sdgs.ts.'}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontWeight: 900, fontSize: 20, marginTop: 8 }}>Organizations for {selectedSdg}</div>
                  )}
                </div>
                <div className="row gap-sm">
                  <button className="btn" type="button" onClick={() => setSelectedSdg(null)}>
                    Close
                  </button>
                </div>
              </div>

              {modalView === 'full' ? (
                <div className="card soft" style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 800 }}>Example indicators</div>
                  <div className="muted tiny" style={{ marginTop: 6 }}>
                    Sample metrics you can track on dashboards.
                  </div>
                  <ul className="muted" style={{ marginTop: 10, paddingLeft: 18 }}>
                    {(selectedInfo?.exampleIndicators ?? ['—']).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div style={{ marginTop: 12, fontWeight: 800 }}>NGOs working on {selectedSdg}</div>
              <div className="muted tiny" style={{ marginTop: 6 }}>
                Click an NGO name to open its details with contact and map.
              </div>

              <div className="row gap-sm" style={{ marginTop: 10, flexWrap: 'wrap' }}>
                {ngosForSelected.map((ngo) => (
                  <button
                    key={ngo.id}
                    type="button"
                    className={'pill' + (selectedNgo?.id === ngo.id ? ' pill-active' : '')}
                    onClick={() => setSelectedNgoId(ngo.id)}
                  >
                    {ngo.name}
                  </button>
                ))}
              </div>

              <div className="list" style={{ marginTop: 12 }}>
                {selectedNgo ? (
                  <EntityCard entity={selectedNgo} />
                ) : (
                  <div className="muted tiny">No NGOs currently tagged with this SDG.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}


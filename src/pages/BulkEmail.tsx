import { useEffect, useMemo, useState } from 'react'
import { draftPartnershipEmail } from '../lib/ai'
import { sendEmail } from '../lib/email'
import { getActiveUser, getEntities } from '../lib/store'
import type { Entity } from '../lib/types'

const tones = ['Professional', 'Warm', 'Direct'] as const

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

export function BulkEmail() {
  const [tick, setTick] = useState(0)
  const [companyFilter, setCompanyFilter] = useState('')
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([])

  const [subject, setSubject] = useState('')
  const [ask, setAsk] = useState('We are looking for a pilot partner / CSR collaboration aligned to our SDG goals.')
  const [tone, setTone] = useState<(typeof tones)[number]>('Professional')
  const [sdgTags, setSdgTags] = useState<string[]>(['SDG 17', 'SDG 9'])
  const [body, setBody] = useState('')

  const [status, setStatus] = useState<string>('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const onAny = () => setTick((t) => t + 1)
    window.addEventListener('sdgconnect:activeUser', onAny)
    return () => window.removeEventListener('sdgconnect:activeUser', onAny)
  }, [])

  const user = useMemo(() => getActiveUser(), [tick])
  const entities = useMemo(() => getEntities(), [tick])

  const me = entities.find((e) => e.id === user.entityId) as Entity | undefined
  const companies = entities.filter((e) => e.kind === 'COMPANY')

  const filteredCompanies = companies.filter((c) => {
    const q = companyFilter.trim().toLowerCase()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.focus.some((s) => s.toLowerCase().includes(q))
    )
  })

  const selectedCompanies = companies.filter((c) => selectedCompanyIds.includes(c.id))

  useEffect(() => {
    // default select all companies
    if (companies.length && selectedCompanyIds.length === 0) {
      setSelectedCompanyIds(companies.map((c) => c.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies.length])

  if (!me) return null

  const canSend = selectedCompanies.length > 0 && subject.trim() && body.trim()

  return (
    <div className="grid-2">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="tag">Bulk email</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 6 }}>
              NGO → Companies (send to all selected)
            </div>
            <div className="muted tiny" style={{ marginTop: 6 }}>
              Includes an AI-style draft helper. Real sending is optional via EmailJS.
            </div>
          </div>
          <div className="card soft" style={{ minWidth: 280 }}>
            <div className="muted tiny">From</div>
            <div style={{ fontWeight: 800 }}>{me.name}</div>
            <div className="muted tiny">{me.email}</div>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 14 }}>
          <div>
            <div className="muted tiny">Subject</div>
            <input
              className="input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Partnership request for SDG pilots"
            />
          </div>
          <div>
            <div className="muted tiny">Tone</div>
            <select className="select" value={tone} onChange={(e) => setTone(e.target.value as any)}>
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted tiny">What are you asking for?</div>
          <textarea
            className="textarea"
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            placeholder="Describe the partnership ask (pilot, CSR, cloud credits, mentorship, etc.)"
          />
        </div>

        <div className="row gap-sm" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          <span className="muted tiny">SDG tags:</span>
          {['SDG 17', 'SDG 9', 'SDG 4', 'SDG 6', 'SDG 7', 'SDG 13'].map((s) => {
            const active = sdgTags.includes(s)
            return (
              <button
                key={s}
                type="button"
                className={'pill' + (active ? ' pill-active' : '')}
                onClick={() =>
                  setSdgTags((prev) =>
                    active ? prev.filter((x) => x !== s) : [...prev, s],
                  )
                }
              >
                {s}
              </button>
            )
          })}
        </div>

        <div className="row gap-sm" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          <button
            className="btn primary"
            type="button"
            onClick={() => {
              const { subject: s, body: b } = draftPartnershipEmail({
                fromNgo: me,
                toCompanies: selectedCompanies,
                subjectHint: subject,
                ask,
                sdgTags,
                tone,
              })
              setSubject(s)
              setBody(b)
              setStatus('Draft generated.')
            }}
          >
            AI draft email
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setBody('')
              setStatus('Cleared.')
            }}
          >
            Clear
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              const all = selectedCompanies.map((c) => c.email).filter(isEmail)
              const mailto = `mailto:${all.join(',')}?subject=${encodeURIComponent(
                subject,
              )}&body=${encodeURIComponent(body)}`
              window.location.href = mailto
            }}
            disabled={!canSend}
            title="Opens your email client (no keys needed)"
          >
            Open in email app
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted tiny">Email body</div>
          <textarea
            className="textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Click “AI draft email” to generate a ready-to-send message."
          />
        </div>

        <div className="row gap-sm" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          <button
            className="btn primary"
            type="button"
            disabled={!canSend || sending}
            onClick={async () => {
              setSending(true)
              setStatus('')
              let ok = 0
              let fail = 0
              for (const c of selectedCompanies) {
                const res = await sendEmail({
                  fromName: me.name,
                  fromEmail: me.email,
                  toEmail: c.email,
                  subject,
                  body,
                })
                if (res.ok) ok += 1
                else fail += 1
              }
              setStatus(
                fail === 0
                  ? `Sent to ${ok} companies.`
                  : `Sent to ${ok} companies, failed for ${fail}. (Check EmailJS config if enabled.)`,
              )
              setSending(false)
            }}
            title="Demo mode simulates sending; EmailJS enables real send"
          >
            {sending ? 'Sending…' : `Send to ${selectedCompanies.length} companies`}
          </button>
          <div className="muted tiny">{status}</div>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 800 }}>Companies list</div>
            <div className="muted tiny" style={{ marginTop: 6 }}>
              Select who should receive the email.
            </div>
          </div>
          <div className="row gap-sm">
            <button
              className="btn"
              type="button"
              onClick={() => setSelectedCompanyIds(companies.map((c) => c.id))}
            >
              Select all
            </button>
            <button className="btn danger" type="button" onClick={() => setSelectedCompanyIds([])}>
              Clear
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <input
            className="input"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            placeholder="Filter companies…"
          />
        </div>

        <div className="list" style={{ marginTop: 12 }}>
          {filteredCompanies.map((c) => {
            const checked = selectedCompanyIds.includes(c.id)
            return (
              <label
                key={c.id}
                className="card soft"
                style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setSelectedCompanyIds((prev) =>
                      e.target.checked ? [...prev, c.id] : prev.filter((x) => x !== c.id),
                    )
                  }}
                  style={{ marginTop: 3 }}
                />
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontWeight: 800 }}>{c.name}</div>
                    <div className="muted tiny">
                      {c.city}, {c.state}
                    </div>
                  </div>
                  <div className="muted tiny" style={{ marginTop: 4 }}>
                    {c.email}
                  </div>
                  <div className="row gap-sm" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                    {c.focus.slice(0, 3).map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}


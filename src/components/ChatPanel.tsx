import { useMemo, useState } from 'react'
import type { Entity } from '../lib/types'
import { getMessages, sendMessage } from '../lib/store'

export function ChatPanel({
  me,
  other,
}: {
  me: Entity
  other: Entity
}) {
  const [text, setText] = useState('')
  const [tick, setTick] = useState(0)

  const messages = useMemo(() => {
    const all = getMessages()
    const relevant = all.filter(
      (m) =>
        (m.fromId === me.id && m.toId === other.id) ||
        (m.fromId === other.id && m.toId === me.id),
    )
    return relevant.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [me.id, other.id, tick])

  return (
    <div className="card chat">
      <div className="row" style={{ justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="muted tiny">Chat with</div>
          <div style={{ fontWeight: 800 }}>{other.name}</div>
        </div>
        <div className="muted tiny">
          {other.email}
        </div>
      </div>

      <div className="chat-log" aria-label="chat log">
        {messages.length === 0 ? (
          <div className="muted tiny">No messages yet. Say hello.</div>
        ) : null}
        {messages.map((m) => (
          <div key={m.id} className={'bubble ' + (m.fromId === me.id ? 'me' : 'them')}>
            <div className="muted tiny" style={{ marginBottom: 6 }}>
              {m.fromId === me.id ? 'You' : other.name} • {new Date(m.createdAt).toLocaleString()}
            </div>
            {m.body}
          </div>
        ))}
      </div>

      <div className="row gap-sm">
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const body = text.trim()
              if (!body) return
              sendMessage(me.id, other.id, body)
              setText('')
              setTick((t) => t + 1)
            }
          }}
        />
        <button
          className="btn primary"
          type="button"
          onClick={() => {
            const body = text.trim()
            if (!body) return
            sendMessage(me.id, other.id, body)
            setText('')
            setTick((t) => t + 1)
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}


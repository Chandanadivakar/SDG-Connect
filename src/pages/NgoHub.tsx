import { useEffect, useMemo, useState } from 'react'
import { EntityCard } from '../components/EntityCard'
import {
  addConnection,
  addNgoPublicPost,
  getActiveUser,
  getConnections,
  getEntities,
  getMessages,
  getNgoPublicPosts,
  replyNgoPublicPost,
  sendMessage,
  setActiveUserKind,
} from '../lib/store'

export function NgoHub() {
  const [tick, setTick] = useState(0)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [recipientId, setRecipientId] = useState<'public' | string>('public')
  const [messageText, setMessageText] = useState('')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    const onAny = () => setTick((t) => t + 1)
    window.addEventListener('sdgconnect:activeUser', onAny)
    window.addEventListener('sdgconnect:connections', onAny)
    window.addEventListener('sdgconnect:messages', onAny)
    window.addEventListener('sdgconnect:ngoPublicPosts', onAny)
    return () => {
      window.removeEventListener('sdgconnect:activeUser', onAny)
      window.removeEventListener('sdgconnect:connections', onAny)
      window.removeEventListener('sdgconnect:messages', onAny)
      window.removeEventListener('sdgconnect:ngoPublicPosts', onAny)
    }
  }, [])

  const user = useMemo(() => getActiveUser(), [tick])
  const entities = useMemo(() => getEntities(), [tick])
  const conns = useMemo(() => getConnections(), [tick])
  const messages = useMemo(() => getMessages(), [tick])
  const publicPosts = useMemo(
    () =>
      getNgoPublicPosts().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [tick],
  )

  const me = entities.find((e) => e.id === user.entityId)
  const ngoOnly = entities.filter((e) => e.kind === 'NGO' && e.id !== user.entityId)

  const filtered = ngoOnly.filter((e) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      e.name.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      e.state.toLowerCase().includes(q) ||
      e.focus.some((s) => s.toLowerCase().includes(q))
    )
  })

  const myNgoThreads = me
    ? ngoOnly
        .map((ngo) => {
          const convo = messages
            .filter(
              (m) =>
                (m.fromId === me.id && m.toId === ngo.id) ||
                (m.fromId === ngo.id && m.toId === me.id),
            )
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          return { ngo, last: convo[0] ?? null, count: convo.length }
        })
        .filter((x) => x.last)
        .sort((a, b) => (b.last?.createdAt ?? '').localeCompare(a.last?.createdAt ?? ''))
    : []

  if (!me) return null
  if (user.kind !== 'NGO') {
    return (
      <div className="card">
        <div style={{ fontWeight: 800, fontSize: 18 }}>NGO to NGO messaging</div>
        <div className="muted tiny" style={{ marginTop: 8 }}>
          This section is only for NGOs. Switch to NGO mode to view specific NGO profiles and reply to NGO messages.
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn primary" type="button" onClick={() => setActiveUserKind('NGO')}>
            Switch to NGO mode
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="split">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="tag">NGO-only hub</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 6 }}>Connect only with NGOs</div>
            <div className="muted tiny" style={{ marginTop: 6 }}>
              Directory + connect + message. (Companies are hidden here.)
            </div>
          </div>
          <div style={{ minWidth: 260 }}>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search NGO by name, city, SDG…"
            />
          </div>
        </div>

        <div className="list" style={{ marginTop: 14 }}>
          {filtered.map((ngo) => {
            const isConnected = conns.some((c) => c.fromId === me.id && c.toId === ngo.id)
            return (
              <EntityCard
                key={ngo.id}
                entity={ngo}
                actions={
                  <>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => setSelectedId(ngo.id)}
                    >
                      Message
                    </button>
                    <button
                      className={'btn ' + (isConnected ? '' : 'primary')}
                      type="button"
                      onClick={() => addConnection(me.id, ngo.id)}
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
          {filtered.length === 0 ? (
            <div className="muted tiny">No NGOs match your search.</div>
          ) : null}
        </div>
      </div>

      <div className="list" style={{ gap: 14 }}>
        <div className="card">
          <div style={{ fontWeight: 800 }}>Main NGO communication hub</div>
          <div className="muted tiny" style={{ marginTop: 8 }}>
            Use one message box: choose <b>Public</b> to post to all NGOs, or choose a specific NGO for private message.
          </div>
          <div style={{ marginTop: 10 }}>
            <div className="grid-2">
              <div>
                <div className="muted tiny">Send message to</div>
                <select
                  className="select"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                >
                  <option value="public">Public (all NGOs)</option>
                  {ngoOnly.map((ngo) => (
                    <option key={ngo.id} value={ngo.id}>
                      {ngo.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="muted tiny" style={{ display: 'flex', alignItems: 'end' }}>
                {recipientId === 'public'
                  ? 'Everyone in NGO hub can see and reply.'
                  : 'Only you and selected NGO can see this private message.'}
              </div>
            </div>
            <textarea
              className="textarea"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={
                recipientId === 'public'
                  ? 'Post publicly to all NGOs...'
                  : 'Type private message to selected NGO...'
              }
              style={{ minHeight: 100, marginTop: 10 }}
            />
            <div className="row gap-sm" style={{ marginTop: 8, flexWrap: 'wrap' }}>
              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  const text = messageText.trim()
                  if (!text) return
                  if (recipientId === 'public') {
                    addNgoPublicPost(me.id, text)
                  } else {
                    sendMessage(me.id, recipientId, text)
                    setSelectedId(recipientId)
                  }
                  setMessageText('')
                }}
                disabled={!messageText.trim()}
              >
                {recipientId === 'public' ? 'Send Public Message' : 'Send Private Message'}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 14, fontWeight: 800 }}>Public NGO messages</div>
          <div className="list" style={{ marginTop: 12 }}>
            {publicPosts.length ? (
              publicPosts.map((post) => {
                const author = entities.find((e) => e.id === post.authorId)
                const replyText = replyDrafts[post.id] ?? ''
                return (
                  <div key={post.id} className="card soft">
                    <div className="row" style={{ justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700 }}>{author?.name ?? 'NGO'}</div>
                      <div className="muted tiny">{new Date(post.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{post.body}</div>
                    <div className="muted tiny" style={{ marginTop: 8 }}>
                      Replies ({post.replies.length})
                    </div>
                    <div className="list" style={{ marginTop: 8 }}>
                      {post.replies.map((r) => {
                        const replyAuthor = entities.find((e) => e.id === r.authorId)
                        return (
                          <div key={r.id} className="card soft" style={{ padding: 10 }}>
                            <div className="row" style={{ justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                              <div className="muted tiny">
                                <b style={{ color: 'var(--text)' }}>{replyAuthor?.name ?? 'NGO'}</b>
                              </div>
                              <div className="muted tiny">{new Date(r.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="muted tiny" style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
                              {r.body}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="row gap-sm" style={{ marginTop: 8 }}>
                      <input
                        className="input"
                        value={replyText}
                        onChange={(e) =>
                          setReplyDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        placeholder="Reply to this public post..."
                      />
                      <button
                        className="btn"
                        type="button"
                        disabled={!replyText.trim()}
                        onClick={() => {
                          replyNgoPublicPost(post.id, me.id, replyText)
                          setReplyDrafts((prev) => ({ ...prev, [post.id]: '' }))
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="muted tiny">No public NGO posts yet. Start the first discussion.</div>
            )}
          </div>
        </div>

        <div className="card">
          <div style={{ fontWeight: 800 }}>Private NGO conversations</div>
          <div className="muted tiny" style={{ marginTop: 8 }}>
            Personal (private) chat with specific NGOs. Only you and that NGO can see these messages.
          </div>
          <div className="list" style={{ marginTop: 10 }}>
            {myNgoThreads.length ? (
              myNgoThreads.map(({ ngo, last, count }) => (
                <button
                  key={ngo.id}
                  type="button"
                  className={'pill' + (selectedId === ngo.id ? ' pill-active' : '')}
                  onClick={() => setSelectedId(ngo.id)}
                  style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
                >
                  <span>{ngo.name}</span>
                  <span className="muted tiny">
                    {count} msg • {last ? new Date(last.createdAt).toLocaleDateString() : ''}
                  </span>
                </button>
              ))
            ) : (
              <div className="muted tiny">No NGO conversations yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}


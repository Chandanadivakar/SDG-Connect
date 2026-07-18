import type {
  ActiveUser,
  Connection,
  Entity,
  Message,
  NgoEvent,
  NgoPublicPost,
  Thread,
  UserKind,
} from './types'
import { mockEntities } from './mock'
import { mockNgoEvents } from './mockEvents'

const LS = {
  seedVersion: 'sdgconnect.seedVersion.v1',
  activeUser: 'sdgconnect.activeUser.v1',
  entities: 'sdgconnect.entities.v1',
  connections: 'sdgconnect.connections.v1',
  threads: 'sdgconnect.threads.v1',
  messages: 'sdgconnect.messages.v1',
  ngoPublicPosts: 'sdgconnect.ngoPublicPosts.v1',
  ngoEvents: 'sdgconnect.ngoEvents.v1',
} as const

const CURRENT_SEED_VERSION = '2026-04-ka-5plus-v2-events'

function nowIso() {
  return new Date().toISOString()
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function ensureSeedData() {
  const savedVersion = localStorage.getItem(LS.seedVersion)
  if (savedVersion !== CURRENT_SEED_VERSION) {
    // Force-refresh local data when mock dataset changes significantly.
    writeJson(LS.entities, mockEntities)
    writeJson<Connection[]>(LS.connections, [])
    writeJson<Thread[]>(LS.threads, [])
    writeJson<Message[]>(LS.messages, [])
    writeJson<NgoPublicPost[]>(LS.ngoPublicPosts, [])
    writeJson<NgoEvent[]>(LS.ngoEvents, mockNgoEvents)
    const ngo = mockEntities.find((e) => e.kind === 'NGO')!
    writeJson(LS.activeUser, { kind: 'NGO', entityId: ngo.id, name: ngo.name })
    localStorage.setItem(LS.seedVersion, CURRENT_SEED_VERSION)
  }

  const existing = readJson<Entity[] | null>(LS.entities, null)
  if (!existing || existing.length === 0) {
    writeJson(LS.entities, mockEntities)
  }
  const active = readJson<ActiveUser | null>(LS.activeUser, null)
  if (!active) {
    // default to an NGO user
    const ngo = mockEntities.find((e) => e.kind === 'NGO')!
    writeJson(LS.activeUser, { kind: 'NGO', entityId: ngo.id, name: ngo.name })
  }
  if (!localStorage.getItem(LS.connections)) writeJson<Connection[]>(LS.connections, [])
  if (!localStorage.getItem(LS.threads)) writeJson<Thread[]>(LS.threads, [])
  if (!localStorage.getItem(LS.messages)) writeJson<Message[]>(LS.messages, [])
  if (!localStorage.getItem(LS.ngoPublicPosts)) writeJson<NgoPublicPost[]>(LS.ngoPublicPosts, [])
  if (!localStorage.getItem(LS.ngoEvents)) writeJson<NgoEvent[]>(LS.ngoEvents, mockNgoEvents)
}

export function getEntities(): Entity[] {
  ensureSeedData()
  return readJson<Entity[]>(LS.entities, mockEntities)
}

export function addEntity(
  payload: Omit<Entity, 'id'> & { id?: string },
) {
  ensureSeedData()
  const entities = getEntities()
  const next: Entity = {
    ...payload,
    id: payload.id ?? `custom_${Date.now().toString(16)}_${Math.random().toString(16).slice(2, 8)}`,
  }
  writeJson(LS.entities, [next, ...entities])
  window.dispatchEvent(new Event('sdgconnect:entities'))
}

export function getActiveUser(): ActiveUser {
  ensureSeedData()
  return readJson<ActiveUser>(LS.activeUser, {
    kind: 'NGO',
    entityId: 'ngo-1',
    name: 'Sahyog Foundation',
  })
}

export function setActiveUserKind(kind: UserKind) {
  ensureSeedData()
  const entities = getEntities()
  const pick = entities.find((e) => e.kind === kind) ?? entities[0]
  writeJson<ActiveUser>(LS.activeUser, { kind, entityId: pick.id, name: pick.name })
  window.dispatchEvent(new Event('sdgconnect:activeUser'))
}

export function getConnections(): Connection[] {
  ensureSeedData()
  return readJson<Connection[]>(LS.connections, [])
}

export function addConnection(fromId: string, toId: string) {
  ensureSeedData()
  const existing = getConnections()
  const already = existing.some((c) => c.fromId === fromId && c.toId === toId)
  if (already) return
  const next: Connection = { id: uid('conn'), fromId, toId, createdAt: nowIso() }
  writeJson(LS.connections, [next, ...existing])
  window.dispatchEvent(new Event('sdgconnect:connections'))
}

export function getThreads(): Thread[] {
  ensureSeedData()
  return readJson<Thread[]>(LS.threads, [])
}

export function getMessages(): Message[] {
  ensureSeedData()
  return readJson<Message[]>(LS.messages, [])
}

export function getOrCreateThread(a: string, b: string): Thread {
  ensureSeedData()
  const threads = getThreads()
  const existing =
    threads.find((t) => (t.memberA === a && t.memberB === b) || (t.memberA === b && t.memberB === a)) ??
    null
  if (existing) return existing
  const next: Thread = { id: uid('thread'), memberA: a, memberB: b, lastMessageAt: nowIso() }
  writeJson(LS.threads, [next, ...threads])
  return next
}

export function sendMessage(fromId: string, toId: string, body: string) {
  ensureSeedData()
  const thread = getOrCreateThread(fromId, toId)
  const messages = getMessages()
  const msg: Message = {
    id: uid('msg'),
    threadId: thread.id,
    fromId,
    toId,
    body: body.trim(),
    createdAt: nowIso(),
  }
  writeJson(LS.messages, [msg, ...messages])

  const threads = getThreads()
  const updated = threads.map((t) => (t.id === thread.id ? { ...t, lastMessageAt: nowIso() } : t))
  writeJson(LS.threads, updated)
  window.dispatchEvent(new Event('sdgconnect:messages'))
}

export function getNgoPublicPosts(): NgoPublicPost[] {
  ensureSeedData()
  return readJson<NgoPublicPost[]>(LS.ngoPublicPosts, [])
}

export function addNgoPublicPost(authorId: string, body: string) {
  ensureSeedData()
  const text = body.trim()
  if (!text) return
  const posts = getNgoPublicPosts()
  const next: NgoPublicPost = {
    id: uid('ngopost'),
    authorId,
    body: text,
    createdAt: nowIso(),
    replies: [],
  }
  writeJson(LS.ngoPublicPosts, [next, ...posts])
  window.dispatchEvent(new Event('sdgconnect:ngoPublicPosts'))
}

export function replyNgoPublicPost(postId: string, authorId: string, body: string) {
  ensureSeedData()
  const text = body.trim()
  if (!text) return
  const posts = getNgoPublicPosts()
  const updated = posts.map((p) =>
    p.id === postId
      ? {
          ...p,
          replies: [
            ...p.replies,
            {
              id: uid('ngoreply'),
              postId,
              authorId,
              body: text,
              createdAt: nowIso(),
            },
          ],
        }
      : p,
  )
  writeJson(LS.ngoPublicPosts, updated)
  window.dispatchEvent(new Event('sdgconnect:ngoPublicPosts'))
}

export function getNgoEvents(): NgoEvent[] {
  ensureSeedData()
  return readJson<NgoEvent[]>(LS.ngoEvents, mockNgoEvents)
}


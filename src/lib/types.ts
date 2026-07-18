export type UserKind = 'NGO' | 'COMPANY'

export type Sdgs =
  | 'SDG 1'
  | 'SDG 2'
  | 'SDG 3'
  | 'SDG 4'
  | 'SDG 5'
  | 'SDG 6'
  | 'SDG 7'
  | 'SDG 8'
  | 'SDG 9'
  | 'SDG 10'
  | 'SDG 11'
  | 'SDG 12'
  | 'SDG 13'
  | 'SDG 14'
  | 'SDG 15'
  | 'SDG 16'
  | 'SDG 17'

export type Entity = {
  id: string
  kind: UserKind
  name: string
  email: string
  phone?: string
  state: 'KA' | 'TN' | 'KL' | 'AP' | 'TG'
  city: string
  latitude?: number
  longitude?: number
  focus: Sdgs[]
  about: string
  website?: string
  resourcesOffered?: string[]
  resourcesNeeded?: string[]
}

export type Connection = {
  id: string
  fromId: string
  toId: string
  createdAt: string
}

export type Message = {
  id: string
  threadId: string
  fromId: string
  toId: string
  body: string
  createdAt: string
}

export type Thread = {
  id: string
  memberA: string
  memberB: string
  lastMessageAt: string
}

export type ActiveUser = {
  kind: UserKind
  entityId: string
  name: string
}

export type NgoPublicReply = {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: string
}

export type NgoPublicPost = {
  id: string
  authorId: string
  body: string
  createdAt: string
  replies: NgoPublicReply[]
}

export type NgoEvent = {
  id: string
  title: string
  organizerNgoId: string
  dateISO: string
  city: string
  state: Entity['state']
  venue: string
  sdgs: Sdgs[]
  summary: string
  volunteersNeeded?: number
  fundingTargetINR?: number
  sponsorNotes?: string
}


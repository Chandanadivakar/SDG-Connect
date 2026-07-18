import type { Entity } from './types'

export type DraftEmailArgs = {
  fromNgo: Entity
  toCompanies: Entity[]
  subjectHint: string
  ask: string
  sdgTags: string[]
  tone: 'Professional' | 'Warm' | 'Direct'
}

export function draftPartnershipEmail(args: DraftEmailArgs) {
  const ngo = args.fromNgo
  const companyNames = args.toCompanies.map((c) => c.name)
  const subject =
    args.subjectHint.trim() ||
    `Partnership request: ${ngo.name} × ${args.sdgTags.slice(0, 2).join(', ')}`

  const greeting =
    companyNames.length === 1
      ? `Hello ${companyNames[0]} team,`
      : `Hello Partnerships/CSR team,`

  const toneLine =
    args.tone === 'Warm'
      ? 'I hope you are doing well.'
      : args.tone === 'Direct'
        ? 'I am reaching out with a focused collaboration request.'
        : 'I am writing to explore a collaboration opportunity.'

  const body = [
    greeting,
    '',
    `${toneLine} I’m ${ngo.name} (${ngo.city}, ${ngo.state}) working on ${ngo.focus.join(
      ', ',
    )}.`,
    '',
    'We would like to explore a partnership with your organization for the following requirement:',
    args.ask.trim()
      ? `${args.ask.trim()}`
      : 'A pilot partnership / CSR collaboration aligned to shared SDG goals.',
    '',
    `Our focus areas include: ${args.sdgTags.length ? args.sdgTags.join(', ') : ngo.focus.join(', ')}.`,
    '',
    'If you are open to this collaboration, we would be glad to schedule a short discussion and share a detailed plan.',
    '',
    'Thank you for your time and consideration.',
    '',
    'Regards,',
    ngo.name,
    ngo.phone ? `Phone: ${ngo.phone}` : '',
    ngo.website ? ngo.website : '',
    `Contact: ${ngo.email}`,
  ]
    .filter(Boolean)
    .join('\n')

  return { subject, body }
}


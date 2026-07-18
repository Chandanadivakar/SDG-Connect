import emailjs from '@emailjs/browser'

export type SendEmailArgs = {
  fromName: string
  fromEmail: string
  toEmail: string
  subject: string
  body: string
}

export type EmailSendResult =
  | { ok: true; mode: 'demo' | 'emailjs' }
  | { ok: false; mode: 'emailjs'; error: string }

function hasEmailJsConfig() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined
  return Boolean(serviceId && templateId && publicKey)
}

export async function sendEmail(args: SendEmailArgs): Promise<EmailSendResult> {
  if (!hasEmailJsConfig()) {
    // demo mode: simulate sending without exposing keys
    await new Promise((r) => setTimeout(r, 450))
    return { ok: true, mode: 'demo' }
  }

  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string

    // Template variables must match your EmailJS template
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: args.fromName,
        reply_to: args.fromEmail,
        to_email: args.toEmail,
        subject: args.subject,
        message: args.body,
      },
      { publicKey },
    )
    return { ok: true, mode: 'emailjs' }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return { ok: false, mode: 'emailjs', error: msg }
  }
}


import { Svix } from 'svix'

const globalForSvix = globalThis as unknown as { svix: Svix | undefined }

function getSvix(): Svix {
  if (globalForSvix.svix) return globalForSvix.svix
  const client = new Svix(process.env.SVIX_API_KEY!, {
    serverUrl: process.env.SVIX_SERVER_URL!,
  })
  if (process.env.NODE_ENV !== 'production') globalForSvix.svix = client
  return client
}

export const SVIX_APP_UID = 'oxygen'

export async function getOrCreateApp() {
  return getSvix().application.getOrCreate({
    name: 'Oxygen',
    uid: SVIX_APP_UID,
  })
}

export function sendEvent(eventType: string, data: object): void {
  getSvix()
    .message.create(SVIX_APP_UID, {
      eventType,
      payload: { type: eventType, data },
    })
    .catch((err) => console.error(`Webhook [${eventType}] failed:`, err))
}

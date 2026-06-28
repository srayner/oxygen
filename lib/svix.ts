import { Svix } from 'svix'

const globalForSvix = globalThis as unknown as { svix: Svix | undefined }

export const svix =
  globalForSvix.svix ??
  new Svix(process.env.SVIX_API_KEY!, {
    serverUrl: process.env.SVIX_SERVER_URL!,
  })

if (process.env.NODE_ENV !== 'production') globalForSvix.svix = svix

export const SVIX_APP_UID = 'oxygen'

export async function getOrCreateApp() {
  return svix.application.getOrCreate({ name: 'Oxygen', uid: SVIX_APP_UID })
}

export function sendEvent(eventType: string, data: object): void {
  svix.message
    .create(SVIX_APP_UID, { eventType, payload: { type: eventType, data } })
    .catch((err) => console.error(`Webhook [${eventType}] failed:`, err))
}

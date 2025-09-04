import { z } from 'zod'

const envSchema = z.object({
  BOT_TOKEN: z.string(),
  GOOGLE_SHEET_ID: z.string(),
  GOOGLE_DRIVE_FOLDER_ID: z.string(),
  client_secret: z.string(),
  client_id: z.string(),
  redirect_uris: z.string(),
})

export const env = envSchema.parse(process.env)

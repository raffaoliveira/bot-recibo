import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { OAuth2Client } from 'google-auth-library'
import { env } from './src/config/env'

const TOKEN_PATH = path.join(process.cwd(), 'token.json')

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
]

function authorize() {
  const { client_secret, client_id, redirect_uris } = env

  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris)

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // para obter o refresh token
    scope: SCOPES,
  })

  console.log('Autorize este app visitando a seguinte URL:')
  console.log(authUrl)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('\nCole o código de autorização aqui: ', async (code) => {
    rl.close()
    try {
      const { tokens } = await oAuth2Client.getToken(code)
      oAuth2Client.setCredentials(tokens)

      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
      console.log(`Token salvo com sucesso em ${TOKEN_PATH}`)
      console.log('Agora você pode iniciar o bot com `pnpm tsx src/bot.ts`')
    } catch (err) {
      console.error('Erro ao obter o token de acesso', err)
    }
  })
}

authorize()

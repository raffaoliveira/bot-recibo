import fs from 'node:fs'
import path from 'node:path'
import type { Readable } from 'node:stream'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { env } from './config/env'

const TOKEN_PATH = path.join(process.cwd(), 'token.json')

function getAuthenticatedClient(): OAuth2Client {
  const { client_secret, client_id, redirect_uris } = env

  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris)

  const tokenContent = fs.readFileSync(TOKEN_PATH, 'utf-8')
  oAuth2Client.setCredentials(JSON.parse(tokenContent))

  return oAuth2Client
}

const auth = getAuthenticatedClient()
const drive = google.drive({ version: 'v3', auth })
const sheets = google.sheets({ version: 'v4', auth })

export async function uploadToDrive(
  fileName: string,
  mimeType: string,
  fileStream: Readable,
  folderId: string,
): Promise<string | null> {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: fileStream,
      },
      fields: 'id, webViewLink',
    })

    const fileId = response.data.id
    if (!fileId) {
      throw new Error('Falha ao obter o ID do arquivo após o upload.')
    }

    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    const file = await drive.files.get({
      fileId,
      fields: 'webViewLink',
    })

    if (!file.data.webViewLink) {
      throw new Error('webViewLink não disponível após upload e permissão.')
    }

    return file.data.webViewLink
  } catch (error) {
    console.error('Erro ao fazer upload para o Google Drive:', error)
    return null
  }
}

export async function appendToSheet(sheetId: string, values: string[]) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    })

    insertNewEmptyLine(sheetId)
  } catch (error) {
    console.error('Erro ao adicionar linha na planilha:', error)
  }
}

async function insertNewEmptyLine(sheetId: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A:A',
  })

  const dataRows = response.data.values || []

  const nonEmptyRows = dataRows.filter(
    (row) => row?.[0]?.toString().trim() !== '',
  )
  const lastDataRowIndex = nonEmptyRows.length

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: lastDataRowIndex - 2,
              endIndex: lastDataRowIndex - 1,
            },
            inheritFromBefore: true,
          },
        },
      ],
    },
  })
}

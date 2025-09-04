import { Readable } from 'node:stream'
import { type Context, Telegraf } from 'telegraf'
import type { Message } from 'telegraf/types'
import { env } from './config/env'
import { appendToSheet, uploadToDrive } from './google'
import { capitalize } from './tools/capitalize'

const { BOT_TOKEN, GOOGLE_SHEET_ID, GOOGLE_DRIVE_FOLDER_ID } = env

const bot = new Telegraf(BOT_TOKEN).on('message', async (ctx: Context) => {
  const havePhoto = ctx.message as Message.PhotoMessage
  if (!havePhoto.photo) {
    return
  }

  if (!('message' in ctx.update)) {
    return
  }

  const message = ctx.update.message as Message.PhotoMessage
  const parts = message.caption?.split('-').map((p) => p.trim())

  if (!parts || parts.length <= 2) {
    ctx.reply(
      'Formato inválido. Por favor, envie a imagem com uma legenda no formato:\n`Descrição do Gasto - Despesa/Receita - Valor`\n\nExemplo: `Limpeza Condomínio - Despesa - 80,00`',
      { parse_mode: 'Markdown' },
    )
    return
  }
  const [description, transaction, value] = parts

  const photoArray = message.photo

  //Telegram envia a foto em vários tamanhos. Pegamos a de maior resolução.
  const bestQualityPhoto = photoArray.at(-1)

  if (!bestQualityPhoto) {
    await ctx.reply('Não foi possível obter a foto enviada. Tente novamente.')
    return
  }
  try {
    await ctx.reply('Processando Recibo...')

    const fileLink = await ctx.telegram.getFileLink(bestQualityPhoto.file_id)

    const response = await fetch(fileLink.href)
    if (!(response.ok && response.body)) {
      await ctx.reply('Não foi possível baixar a imagem do Telegram.')
      return
    }
    const imageStream = Readable.fromWeb(response.body)

    const fileName = `${description}-${Date.now()}.jpg`
    const driveLink = await uploadToDrive(
      fileName,
      'image/jpeg',
      imageStream,
      GOOGLE_DRIVE_FOLDER_ID,
    )

    if (!driveLink) {
      await ctx.reply(
        'Desculpe, ocorreu um erro ao salvar sua imagem no Google Drive.',
      )
      return
    }

    const today = new Date().toLocaleDateString('pt-BR')
    const rowData = [
      today,
      description.trim(),
      capitalize(transaction.trim()),
      value.trim().replace('.', ','),
      `=HYPERLINK("${driveLink}";"📎 Ver Comprovante")`,
    ]
    await appendToSheet(GOOGLE_SHEET_ID, rowData)

    await ctx.reply('Recibo registrado com sucesso!')
  } catch (error) {
    console.error('Erro no processamento do recibo:', error)
    await ctx.reply(
      'Ocorreu um erro inesperado ao processar o recibo. Tente novamente mais tarde.',
    )
  }
})

bot.start((ctx) =>
  ctx.reply(
    'Olá! Me envie uma foto do recibo com uma descrição para ser registrado.',
  ),
)

console.log('Bot iniciado...')
bot.launch()

// Garante que o bot pare de forma elegante
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

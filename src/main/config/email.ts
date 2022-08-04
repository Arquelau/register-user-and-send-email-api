import { EmailOptions } from '@/usecases/send-email/ports'

const attachmentsCustom = [{
  filename: 'text.txt',
  path: '../../resources/text.txt'
}]

export function getEmailOptions (): EmailOptions {
  const fromCustom = 'Felipinho do mau | Teste do caralho <felipe@arrombado.com>'
  const toCustom = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: fromCustom,
    to: toCustom,
    subject: 'Mensagem de teste',
    text: 'Texto da mensagem',
    html: '<b> Texto da mensagem </b>',
    attachments: attachmentsCustom
  }
  return mailOptions
}

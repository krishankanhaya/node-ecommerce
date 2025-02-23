import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
})

const sendMailer = async (from: string, to: string, subject: string, text: string, html: string) => {
  try {
    const info = await transport.sendMail({ from: from, to: to, subject: subject, text: text, html: html })
    console.log('Message send : ', info.messageId)
  } catch (error) {
    console.log(error);
  }
}

export default sendMailer

import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 587,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  }
});

export default transporter;





















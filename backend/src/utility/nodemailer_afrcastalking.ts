import nodemailer from "nodemailer";
import africasTalking from "africastalking";
export const nodemailerTransporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
})

export const africasTalkingClient = africasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY!,
  username: process.env.AFRICAS_TALKING_USERNAME!,
});



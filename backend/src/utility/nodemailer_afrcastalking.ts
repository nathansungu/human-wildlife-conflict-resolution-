import nodemailer from "nodemailer";
import axios from "axios";
import africasTalking from "africastalking";
export const nodemailerTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const celcomAfricaSms = async (message:string, phone:string) => {
  try {
    const url = "https://isms.celcomafrica.com/api/services/sendsms/";

    const payload = {
      partnerID: process.env.CELCOM_PARTNER_ID!,
      apikey: process.env.CELCOM_API_KEY!,
      mobile: phone,
      message: message,
      shortcode: "TEXTME",
      pass_type: "plain", // "plain" or "bm5"
    };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });

    console.log("SMS Response:", response.data);
  } catch (error: any) {
    console.error("SMS Error:", error.response?.data || error.message);
  }
};

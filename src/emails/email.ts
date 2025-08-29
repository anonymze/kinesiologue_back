import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // false for 587 (STARTTLS)
  requireTLS: true,
  tls: {
    rejectUnauthorized: true,
  },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(mailOptions: Mail.Options) {
  try {
    // console.log("Sending email with config:", {
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   user: process.env.SMTP_USER,
    //   to: mailOptions.to,
    // });

    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      ...mailOptions,
    });

    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

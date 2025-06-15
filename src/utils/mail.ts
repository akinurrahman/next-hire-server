import config from "config";
import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const smtpEmail = config.get<string>("smtpEmail")
const smtpPassword = config.get<string>("smtpPassword")

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: smtpEmail,
      pass: smtpPassword,
    },
  });

  const mailOptions = {
    from: `"Next-Hire" <${smtpEmail}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

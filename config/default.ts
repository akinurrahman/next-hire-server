export default {
  PORT: Number(process.env.PORT) || 8000,
  MONGO_URI: process.env.MONGO_URI || "",
  saltWorkFactor: 10,
  smtpEmail: process.env.SMTP_EMAIL || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  JWT_SECRET: process.env.JWT_SECRET,
};

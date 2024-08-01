import { configEnv, logger } from "@/config";
import nodemailer from "nodemailer";
import { InternalServerError } from "@/api/errors";

// create transporter
const transporter = nodemailer.createTransport({
  //@ts-ignore
  host: configEnv.SMTP_HOST,
  port: configEnv.SMTP_PORT,
  secure: configEnv.SMTP_SECURE === "true" ? true : false,
  auth: {
    user: configEnv.SMTP_USER,
    pass: configEnv.SMTP_PASS,
  },
});

export const sendMailByNodeMailer = async ({
  to,
  from,
  subject,
  mailBody,
}: {
  to?: string;
  from?: string;
  subject: string;
  mailBody: any;
}) => {
  const mailOptions = {
    from: from || configEnv.SMTP_FROM,
    to: to || configEnv.SMTP_FROM,
    subject,
    html: mailBody,
  };
  try {
    await transporter.sendMail(mailOptions);
    logger.info("Mail sent successfully");
  } catch (error: any) {
    logger.error(error.message);
    throw new InternalServerError(error.message, error);
  }
};

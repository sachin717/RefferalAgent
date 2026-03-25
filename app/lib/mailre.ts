import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  text: string
) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "resume.pdf"
  );

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,

    attachments: [
      {
        filename: "Sachin_Resume.pdf",
        path: filePath,
      },
    ],
  });

  console.log("Mail sent to", to);
}
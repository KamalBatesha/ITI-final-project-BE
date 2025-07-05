import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html, attachment) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDEMAIL_EMAIL,
      pass: process.env.SENDEMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from:process.env.SENDEMAIL_EMAIL,
    to: to,
    subject: subject ? subject : "Hello ✔",
    attachment: attachment ? attachment : [],
    html: html,
  });
};

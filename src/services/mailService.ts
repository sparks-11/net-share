import nodemailer from "nodemailer";

interface options {
  body: string;
  username: string;
  sendto: string;
}
export default async function writeMailToUser(options: options) {
  const { body, username, sendto } = options;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_SALT,
    },
  });

  try {
    await transporter.sendMail({
      from: '"netShare" <godgamergg560@gmail.com>',
      to: sendto,
      subject: `Hello from ${username}`,
      text: `These are the details attached by the sender please take a look at it.`,
      html: `<strong>${body}</strong>`,
      headers: { "x-myheader": "test header" },
    });
    return "message send successfully";
  } catch (error) {
    return "something went wrong" + error;
  }
}

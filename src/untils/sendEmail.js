require('dotenv').config();
const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: process.env.SERVICE,
      port:process.env.EMAIL_PORT,
      secure: process.env.SECURE,
      auth: {
        user: "hoanghuy1812003@gmail.com",
        pass: "tfzd sxfu htsr rnfg",
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};

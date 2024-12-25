require('dotenv').config();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
module.exports = async (email, subject, templateName, data) => {
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
    const htmlContent = await ejs.renderFile(path.join(__dirname, `../views/emails/${templateName}.ejs`), data);

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: htmlContent,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};

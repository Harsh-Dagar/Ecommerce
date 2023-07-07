const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
let testAccount = await nodeMailer.createTestAccount();
  const transporter = nodeMailer.createTransport({
    service:"gmail",
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD, 
    },
  }); 
 
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  console.log(mailOptions);


  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
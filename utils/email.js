const nodemailer = require('nodemailer');

module.exports = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `inShare <${options.from}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
};

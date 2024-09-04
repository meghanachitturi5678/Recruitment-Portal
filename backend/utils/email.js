const Resend = require("resend").Resend;
const resend = new Resend(process.env.RESEND);

const sendEmail = async (to, subject, content) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_EMAIL,
      to: process.env.RESEND_EMAIL_TO ? process.env.RESEND_EMAIL_TO : to,
      subject: subject,
      html: "This email was sent to " + to + "\n" + content,
    });
    return "Email sent successfully";
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = { sendEmail };

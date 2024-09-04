const router = require("express").Router();
const FormModel = require("../models/form");

const sendEmail = require("../utils/email").sendEmail;

router.route("/").post(async (req, res) => {
  const { to, subject, body, applicationID } = req.body;
  const application = await FormModel.findById(applicationID);
  if (application) {
    application.emailSent = true;
    await application.save();
  }

  const resp = await sendEmail(to, subject, body);
  if (resp === "Email sent successfully") {
    res.json("Email sent successfully");
  } else res.status(400).json("Error: " + resp);
});

module.exports = router;

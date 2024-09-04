const CASAuthentication = require("node-cas-authentication");
const router = require("express").Router();

const jwt = require("jsonwebtoken");

const Employee = require("../models/employees");

var cas = new CASAuthentication({
  cas_url: process.env.CAS_SERVER_URL,
  service_url: process.env.SERVICE_URL,
  cas_version: "3.0",
  renew: false,
  is_dev_mode: false,
  dev_mode_user: "",
  dev_mode_info: {},
  session_name: "cas_user",
  session_info: "cas_userinfo",
  destroy_session: false,
  return_to: process.env.REDIRECT_URL,
});

router.get("/", cas.bounce, async (req, res) => {
  const ticket = req.query.ticket;

  if (ticket) {
    cas.validate(ticket, function (err, status, username, extended) {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      }

      if (status) {
        res.send(
          "Success! Logged in as " +
            username +
            " with extended attributes: " +
            JSON.stringify(extended)
        );
      }
    });
  }

  const user = req.session[cas.session_info || {}];
  const email = user["e-mail"];
  const name = user["name"];

  const payload = {
    email: email,
    name: name,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY);

  res.cookie("token", token, { httpOnly: true });
  res.cookie("name", name, { httpOnly: false });
  res.cookie("email", email, { httpOnly: false });

  const employee = await Employee.findOne({ email: email }).exec();
  if (!employee) res.cookie("role", "HR", { httpOnly: false });
  else res.cookie("role", "Head", { httpOnly: false });

  res.redirect(process.env.REDIRECT_URL);
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("name");
  res.clearCookie("email");
  res.redirect(process.env.CAS_SERVER_URL + "/logout");
});

router.get("/validate", (req, res) => {
  const token = req.cookies.token;
  const name = req.cookies.name;
  const email = req.cookies.email;

  if (!token || !name || !email) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.json({
    token: token,
    name: name,
    email: email,
  });
});

module.exports = router;

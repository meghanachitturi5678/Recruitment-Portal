require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const FormModel = require("./routes/apply");
const Position = require("./routes/positions");
const Employees = require("./routes/employees");
const Track = require("./routes/track");
const Template = require("./routes/templates");
const Email = require("./routes/email");
const Login = require("./routes/login");
const Sequence = require("./models/sequence");

var session = require("express-session");

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    initializeSequence().catch((err) =>
      console.error("Error initializing sequence:", err)
    );
    console.log(`Database connected successfully`);
  })
  .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

const fs = require("fs");
const dir = "./data";
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const photoDir = "./data/photos";
if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir);
const resumeDir = "./data/resumes";
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir);

async function initializeSequence() {
  const sequence = await Sequence.findOneAndUpdate(
    { _id: "template_sequence" },
    {},
    { upsert: true, new: true }
  );
}

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());

app.use("/apply", FormModel);
app.use("/positions", Position);
app.use("/track", Track);
app.use("/templates", Template);
app.use("/employees", Employees);
app.use("/email", Email);
app.use("/login", Login);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

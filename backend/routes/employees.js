const router = require("express").Router();
const employees = require("../models/employees");

router.route("/").get((req, res) => {
  employees
    .find()
    .then((employees) => res.json(employees))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;

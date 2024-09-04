const router = require("express").Router();
const FormModel = require("../models/form");
const PositionModel = require("../models/positions");

router.get("/:id", (req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).json("Error: Invalid ID");
    return;
  }

  FormModel.findById(req.params.id)
    .then(async (data) => {
      if (!data) {
        res.status(404).json("Error: Application not found");
        return;
      }

      const { name, phoneNumber, createdAt, email, position, status } =
        data._doc;
      const positionDetails = await PositionModel.findOne({
        roleName: position,
      })
        .select("description type requirements responsibilities salary")
        .exec();
      const dict = {
        name:
          name.middleName === ""
            ? `${name.firstName} ${name.lastName}`
            : `${name.firstName} ${name.middleName} ${name.lastName}`,
        phoneNumber: `${phoneNumber.countryCode} ${phoneNumber.phNumber}`,
        submittedAt: createdAt,
        email: email,
        position: position,
        status: status,
        description: positionDetails.description,
        type: positionDetails.type,
        requirements: positionDetails.requirements,
        responsibilities: positionDetails.responsibilities,
        salary: positionDetails.salary,
      };
      res.json(dict);
    })
    .catch((err) => res.status(500).json("Error: " + err));
});

module.exports = router;

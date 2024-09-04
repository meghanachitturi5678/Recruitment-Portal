const router = require("express").Router();
const position = require("../models/positions");

router.route("/").get((req, res) => {
  position
    .find()
    .then((positions) => res.json(positions))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/edit/:id").put(async (req, res) => {
  const {
    roleName,
    description,
    type,
    requirements,
    responsibilities,
    salary,
    postingDate,
    hiringDuration,
    startDate,
    endDate,
    advtNo,
    status,
  } = req.body;

  try {
    const updatedPosition = await position.findByIdAndUpdate(
      req.params.id,
      {
        roleName,
        description,
        type,
        requirements,
        responsibilities,
        salary: Number(salary),
        postingDate,
        hiringDuration,
        startDate: Date.parse(startDate),
        endDate: Date.parse(endDate),
        advtNo,
        status,
      },
      { new: true }
    );

    if (!updatedPosition) {
      return res.status(404).json({ message: "Position not found" });
    }

    res.json(updatedPosition);
  } catch (err) {
    res.status(400).json({ message: "Error updating position", error: err });
  }
});

router.delete("/:id", (req, res) => {
  position
    .findByIdAndDelete(req.params.id)
    .then((deletedPosition) => {
      if (!deletedPosition) {
        return res.status(404).json({ error: "Position not found" });
      }
      res.json({ message: "Position deleted successfully" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.route("/add").post((req, res) => {
  const roleName = req.body.roleName;
  const description = req.body.description;
  const type = req.body.type;
  const requirements = req.body.requirements;
  const responsibilities = req.body.responsibilities;
  const salary = Number(req.body.salary);
  const postingDate = req.body.postingDate;
  const hiringDuration = req.body.hiringDuration;
  const startDate = Date.parse(req.body.startDate);
  const endDate = Date.parse(req.body.endDate);
  const advtNo = req.body.advtNo;
  const status = "Open";

  const newPosition = new position({
    roleName,
    description,
    type,
    requirements,
    responsibilities,
    salary,
    postingDate,
    hiringDuration,
    startDate,
    endDate,
    advtNo,
    status,
  });

  newPosition
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;

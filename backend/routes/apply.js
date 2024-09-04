const router = require("express").Router();
const FormModel = require("../models/form");
const Employee = require("../models/employees");
const path = require("path");
const fs = require("fs");
const sendEmail = require("../utils/email").sendEmail;

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationDirectory = "data/" + file.fieldname + "s";
    cb(null, destinationDirectory);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      path.basename(file.originalname) +
        "_temp" +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

function calculateAge(dobString) {
  const dob = new Date(dobString);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dob.getFullYear();

  if (
    currentDate.getMonth() < dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() &&
      currentDate.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

function determineNextStatus(currentStatus) {
  switch (currentStatus) {
    case "Applied":
      return "Shortlisted";
    case "Shortlisted":
      return "Round 1";
    case "Round 1":
      return "Round 2";
    case "Round 2":
      return "Selected";
    default:
      return currentStatus;
  }
}

router.get("/", (req, res) => {
  FormModel.find()
    .then((data) => res.json(data))
    .catch((err) => res.json("Error: " + err));
});

router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  try {
    const application = await FormModel.findById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    let nextStatus;
    if (action === "select") {
      nextStatus = determineNextStatus(application.status);
    } else if (action === "reject") {
      nextStatus = "Rejected";
    } else {
      return res.json({ error: "Invalid action." });
    }

    application.status = nextStatus;
    if (application.forwardedTo !== "") {
      application.forwardedTo = "";
    }
    application.emailSent = false;
    await application.save();

    return res.json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.json({ error: "Failed to update status." });
  }
});

router.put("/:id/forward", async (req, res) => {
  const { id } = req.params;
  const { dept, body } = req.body;

  const deptDetails = await Employee.findOne({ department: dept });
  const emailText = body.replace("{name}", deptDetails.name);

  const resp = await sendEmail(
    deptDetails.email,
    "Candidate Application for review",
    emailText
  );

  if (resp != "Email sent successfully") {
    return res
      .status(400)
      .json({ error: "Could not send email to department." });
  }

  try {
    const application = await FormModel.findById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    application.forwardedTo = dept;
    await application.save();

    return res.json(application);
  } catch (error) {
    console.error("Error forwarding application:", error);
    return res.json({ error: "Failed to update status." });
  }
});

router.post(
  "/add",
  upload.fields([{ name: "photo" }, { name: "resume" }]),
  (req, res) => {
    const name = {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
    };
    const phoneNumber = {
      countryCode: req.body.countryCode,
      phNumber: req.body.phNumber,
    };
    const email = req.body.email;
    const address = {
      building: req.body.building,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pincode: req.body.pincode,
    };
    const dob = req.body.dob;
    const gender = req.body.gender;
    const nationality = req.body.nationality;
    const position = req.body.position;
    const reasonToHire = req.body.reasonToHire;
    const pastExperience = req.body.pastExperience;
    const techExperience = req.body.techExperience;
    const status = "Applied";
    const age = calculateAge(req.body.dob);

    const newSubmission = new FormModel({
      name,
      phoneNumber,
      email,
      address,
      dob,
      gender,
      nationality,
      position,
      reasonToHire,
      pastExperience,
      techExperience,
      status,
      age,
    });

    if (!newSubmission) {
      return res
        .status(500)
        .json(
          "Error: An error occurred while processing the form. Please try again."
        );
    }

    newSubmission
      .save()
      .then((data) => {
        const photoPath = path.join(
          "data/photos",
          `${data._id}${path.extname(req.files.photo[0].originalname)}`
        );
        fs.rename(req.files.photo[0].path, photoPath, (err) => {
          if (err) throw err;
        });

        const resumePath = path.join(
          "data/resumes",
          `${data._id}${path.extname(req.files.resume[0].originalname)}`
        );
        fs.rename(req.files.resume[0].path, resumePath, (err) => {
          if (err) throw err;
        });

        const { __v, _id, name, phoneNumber, createdAt, updatedAt, ...rest } =
          data._doc;
        rest.refID = _id;
        rest.name =
          name.middleName === ""
            ? `${name.firstName} ${name.lastName}`
            : `${name.firstName} ${name.middleName} ${name.lastName}`;
        rest.phoneNumber = `${phoneNumber.countryCode} ${phoneNumber.phNumber}`;
        rest.submittedAt = createdAt;
        res.json(rest);
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json("Error: An error occurred while saving the form data.");
      });
  }
);

router.get("/:id", (req, res) => {
  if (req.params.id === "all") {
    FormModel.find()
      .then((data) => res.json(data))
      .catch((err) => res.json("Error: " + err));
  } else if (req.params.id === "add") {
    res.status(405).json("Method not allowed");
  } else
    FormModel.findById(req.params.id)
      .then((data) => {
        if (data) {
          res.json(data);
        } else {
          res.json("Error: Application not found");
        }
      })
      .catch((err) => {
        const error = {
          Error: "Wrong application ID. Please check the ID and try again.",
        };
        res.json(error);
      });
});

function findFileById(id, directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const matchingFiles = files.filter((file) => {
        const filename = path.basename(file);
        const fileId = filename.split(".")[0];
        return fileId === id;
      });

      if (matchingFiles.length > 0) {
        resolve(path.join(directory, matchingFiles[0]));
      } else {
        reject(
          new Error(`File with ID ${id} not found in directory ${directory}`)
        );
      }
    });
  });
}

router.get("/:id/photo", (req, res) => {
  const id = req.params.id;
  if (id.length !== 24) {
    res.json("Error: Invalid ID");
    return;
  }

  FormModel.findById(id)
    .then((data) => {
      if (data) {
        const photo = findFileById(id, "data/photos");
        photo
          .then((photoPath) => {
            res.sendFile(path.resolve(photoPath), (err) => {
              if (err) {
                console.log(err);
                res.json("Error: Failed to send photo");
              }
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        res.json("Error: Application not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.json("Error: Internal server error");
    });
});

router.get("/:id/resume", (req, res) => {
  const id = req.params.id;
  if (id.length !== 24) {
    res.json("Error: Invalid ID");
    return;
  }

  FormModel.findById(id)
    .then((data) => {
      if (data) {
        const photo = findFileById(id, "data/resumes");
        photo
          .then((photoPath) => {
            res.sendFile(path.resolve(photoPath), (err) => {
              if (err) {
                console.log(err);
                res.json("Error: Failed to send resume");
              }
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        res.json("Error: Application not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.json("Error: Internal server error");
    });
});

module.exports = router;

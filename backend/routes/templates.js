const router = require("express").Router();
const TemplateModel = require("../models/templates");
const Sequence = require("../models/sequence");

router.route("/").get((req, res) => {
  TemplateModel.find()
    .then((templates) => {
      data = templates.map((template) => {
        return {
          id: template._id,
          name: template.name,
          desc: template.desc ? template.desc : "desc",
          subject: template.subject,
          content: template.content,
        };
      });
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/add", async (req, res) => {
  const { name, desc, subject, content } = req.body;

  try {
    const sequenceDocument = await Sequence.findOneAndUpdate(
      { _id: "template_sequence" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const newTemplate = new TemplateModel({
      _id: sequenceDocument.sequence_value,
      name,
      desc,
      subject,
      content,
    });

    await newTemplate.save();
    res.json("Template added!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.route("/edit/:id").put(async (req, res) => {
  const { templateName, subject, content } = req.body;

  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      { templateName, subject, content },
      { new: true }
    );

    if (!updatedTemplate)
      return res.status(404).json({ message: "Template not found" });

    res.json(updatedTemplate);
  } catch (err) {
    res.status(400).json({ message: "Error updating template", error: err });
  }
});

router.route("/:id").delete((req, res) => {
  TemplateModel.findByIdAndDelete(req.params.id)
    .then((deletedTemplate) => {
      if (!deletedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(deletedTemplate);
    })
    .catch((err) =>
      res.status(400).json({ message: "Error deleting template", error: err })
    );
});

module.exports = router;

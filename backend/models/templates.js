const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  _id: { type: Number, required: true },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  desc: {
    type: String,
    required: [true, "Description is required"],
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
});

const Template = mongoose.model("Templates", TemplateSchema);

module.exports = Template;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PositionSchema = new Schema({
  roleName: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  type: {
    type: String,
    enum: ["Regular", "Consolidated", "Outsourcing"],
    required: [true, "Positon type is required"],
  },
  requirements: {
    type: String,
    required: [true, "Requirements are required"],
  },
  responsibilities: {
    type: String,
    required: [true, "Responsibilities are required"],
  },
  salary: {
    type: Number,
    required: [true, "Salary is required"],
  },
  postingDate: {
    type: Date,
    required: [true, "Posting date is required"],
  },
  hiringDuration: {
    type: String,
    required: [true, "Hiring duration is required"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  advtNo: {
    type: String,
    unique: [true, "Duplicate Advertisement Number"],
    required: [true, "Advertisement Number is required"],
  },
  status: {
    type: String,
  },
});

const Position = mongoose.model("Positions", PositionSchema);

module.exports = Position;

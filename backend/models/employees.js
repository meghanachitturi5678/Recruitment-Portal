const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  department: {
    type: String,
    required: [true, "Department type is required"],
  },
});

const Employees = mongoose.model("Employees", EmployeeSchema);

module.exports = Employees;

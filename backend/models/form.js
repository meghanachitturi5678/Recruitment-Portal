const mongoose = require("mongoose");
const DateOnly = require("mongoose-dateonly")(mongoose);
const Schema = mongoose.Schema;

const FormSchema = new Schema(
  {
    name: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
      },
    },
    phoneNumber: {
      countryCode: {
        type: String,
        required: [true, "Country code is required"],
      },
      phNumber: {
        type: String,
        required: [true, "Phone number is required"],
      },
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    address: {
      building: {
        type: String,
        required: [true, "Building Name is required"],
      },
      addressLine1: {
        type: String,
        required: [true, "Address line 1 is required"],
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
      pincode: {
        type: Number,
        required: [true, "Pincode is required"],
      },
    },
    dob: {
      type: DateOnly,
      required: [true, "DOB is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
    },
    reasonToHire: {
      type: String,
    },
    pastExperience: {
      type: String,
    },
    techExperience: {
      type: String,
    },
    status: {
      type: String,
    },
    age: {
      type: String,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    forwardedTo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
FormSchema.index({ email: 1, position: 1 }, { unique: true });
const FormModel = mongoose.model("Applications", FormSchema);

module.exports = FormModel;

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true
    },

    age: {
      type: Number,
      required: true,
      min: 0
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    phone: {
      type: String
    },

    address: {
      type: String
    },

    disease: {
      type: String
    },

    doctor: {
      type: String
    },

    status: {
      type: String,
      enum: ["Waiting", "Treating", "Recovered"],
      default: "Waiting"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Patient", patientSchema);
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null,     // optional at signup
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
  },
});

module.exports = mongoose.model("Profile", profileSchema);

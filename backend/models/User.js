const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
    },
    college: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Student", "Working Professional", "Other"],
      default: "Other",
    },
    bio: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    questionsAsked: {
      type: Number,
      default: 0,
    },
    answersGiven: {
      type: Number,
      default: 0,
    },
    votesReceived: {
      type: Number,
      default: 0,
    },
    discussionsCreated: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

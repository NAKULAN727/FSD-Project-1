const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    answersCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        text: String,
        author: String,
        votes: { type: Number, default: 0 },
        accepted: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Question", questionSchema);

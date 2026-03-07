const mongoose = require("mongoose");

const privateQuestionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        askedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        visibleTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        answers: [
            {
                text: String,
                author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                authorName: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("PrivateQuestion", privateQuestionSchema);

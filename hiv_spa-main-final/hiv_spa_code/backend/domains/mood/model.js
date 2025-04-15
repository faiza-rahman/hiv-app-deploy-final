const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mood: {
        type: String,
        enum: ["VeryHappy", "Happy", "Neutral", "VerySad", "Sad", "Angry"]
    },
    date: {
        type: Date,
        required: true,
    },
    diaryEntry: {
        type: String,
        default: ""
    },
    hasDiaryEntry: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Mood", moodSchema);
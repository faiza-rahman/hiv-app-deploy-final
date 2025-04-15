const mongoose = require("mongoose");

const symptomSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    symptoms: [String]
});

const SymptomLog = mongoose.model("SymptomLog", symptomSchema);
module.exports = SymptomLog;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicationSchema = new Schema({
    name: String, // name of the medication
    dose: String, // dose of the medication
    frequency: String, // frequency of the medication
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user ID of the user who is taking the medication
    fhirId: String, // store the associated FHIR ID
});

module.exports = mongoose.model("Medication", MedicationSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String, // name of the user
    email: { type: String, unqiue: true }, // email of the user
    password: String, // password of the user
    token: String, // unqiue token of the user for authentication
    fhirId: String, // store the associated FHIR ID
});

const fhirPatientSchema = new Schema({
    fhirId: { type: String, unique: true }, // FHIR ID
    patientData: Object,
    assigned: { type: Boolean, default: false }, // whether the patient is assigned to a user
});


const User = mongoose.model("User", UserSchema);
const FhirPatient = mongoose.model("FhirPatient", fhirPatientSchema);
module.exports = { User, FhirPatient };
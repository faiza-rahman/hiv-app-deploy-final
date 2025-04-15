const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String, // name of the user
    email: { type: String, unqiue: true }, // email of the user
    password: String, // password of the user
    token: String, // unqiue token of the user for authentication
    fhirId: String, // store the associated FHIR ID
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
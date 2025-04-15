const Medication = require("./model");
const fs = require("fs");
const path = require("path");
const { json } = require("stream/consumers");

const addMedication = async (data) => {
    console.log("adding medication...");
    try {
        console.log(data.fhirId);
        const medications = data.medications
        console.log("got meds")
        // remove all unknown medications
        const filt1_meds = medications.filter(med => med.name !== "Unknown Medication");
        // remove all unknown doses
        const filt2_meds = filt1_meds.filter(med => med.dose !== "Unknown Dose");
        // remove all unknown frequencies
        //const filt3_meds = filt2_meds.filter(med => med.frequency !== "Unknown Frequency");
        console.log("filtered medications");
        // remove all duplicate medications
        const meds = filt2_meds.filter((med, index, self) => self.findIndex(m => m.name === med.name) === index);
        console.log("medications", meds);
        if (!meds || meds.length === 0) {
            console.error("No medications found in FHIR data");
            return null;
        }
        const medRecords = meds.map(med => ({ ...med, userId: data.userId }));
        console.log("medRecords", medRecords);
        return await Medication.insertMany(medRecords);
    } catch (error) {
        console.error("Error adding medication:", error);
        return null;
    }
}

const getMedications = async (data) => {
    try {
        console.log("fetching medications for user:", data.userId);
        const medications = await Medication.find({ userId: data.userId });
        console.log("queried medications:", medications);
        return medications;
    } catch (error) {
        console.error("Error fetching medications:", error);
        return null;
    }
}

module.exports = { addMedication, getMedications };
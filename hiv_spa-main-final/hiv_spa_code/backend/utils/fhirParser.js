const fs = require("fs");
const path = require("path");

const locateFhirFile = (fhirId) => {
    console.log("locating FHIR file");
    const fhirOutputPath = path.join(__dirname, "../../backend/synthea/output/fhir/");
    console.log("fhirOutputPath", fhirOutputPath);
    try {
        console.log("in try block");
        if (!fs.existsSync(fhirOutputPath)) {
            console.log("FHIR output directory not found");
            throw new Error("FHIR output directory not found");
        }
        // Read all files in the FHIR output directory
        const files = fs.readdirSync(fhirOutputPath);
        console.log("files");
        //console.log("length", files.length);
        if (files.length === 0) {
            throw new Error("No FHIR files found");
        }

        // Find the file that contains the FHIR ID in its name
        const fhirFile = files.find(file => file.includes(fhirId) && file.endsWith(".json"));

        if (!fhirFile) {
            throw new Error(`FHIR file not found for ID: ${fhirId}`);
        }

        // Return the full path to the FHIR file
        return path.join(fhirOutputPath, fhirFile);
    } catch (error) {
        console.error("Error locating FHIR file:", error.message);
        throw error;
    }
};

const extractMedication = async (data) => {
    console.log("extracting medication from FHIR data");
    try {
        console.log("in try block");
        const fhirFilePath = locateFhirFile(data.fhirId);
        console.log("fhirFilePath", fhirFilePath);
        if (!fs.existsSync(fhirFilePath)) {
            console.log(`FHIR file not found: ${fhirFilePath}`);
            console.error(`FHIR file not found: ${fhirFilePath}`);
            return null;
        }

        const fhirData = fs.readFileSync(fhirFilePath, "utf8");
        const fhirJson = JSON.parse(fhirData);
        const medication = fhirJson.entry.filter((entry) => entry.resource.resourceType === "MedicationRequest");

        return medication.map(entry => {
            const med = entry.resource;
            return {
                name: med.medicationCodeableConcept?.text || "Unknown Medication",
                //dose: med.dosageInstruction[0].doseAndRate[0].doseQuantity.value,
                dose: med.dosageInstruction?.[0]?.text || "Unknown Dose",
                frequency: med.dosageInstruction?.[0]?.timing?.repeat?.frequency || "Unknown Frequency",
            };
        });
    } catch (error) {
        console.error("Error extracting medication:", error);
        return null;
    }
}

module.exports = { extractMedication };
const User = require("./model");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { hashData, verifyHashdata } = require("../../utils/hashData");
const createToken = require("../../utils/createToken");
const { json } = require("stream/consumers");
const { extractMedication } = require("../../utils/fhirParser");
const { addMedication, getMedications } = require("../medication/controller");

const SYNTHEA_PATH = "../synthea"; // path to synthea executable, TODO: change
const FHIR_SERVER_URL = "http://localhost:5000/fhir/Patient"; // assuming local FHIR storage API

// generate a new Synthea patient
const generateSyntheaPatient = async (data) => {
    return new Promise((resolve, reject) => {
        console.log("generating patient...");
        const { name } = data;
        // split the given name into first and last name
        const [firstName, lastName] = name.split(" ");
        console.log("firstName:", firstName);
        console.log("lastName:", lastName);
        exec(`cd synthea && ./run_synthea -p 1 --givenname "${firstName}" --surname "${lastName}"`, (error, stdout, stderr) => {
        //exec('${SYNTHEA_PATH}/run_synthea -p 1', (error, stdout, stderr) => {
            if (error) {
                console.error('synthea execution error:', error);
                return reject(new Error(`Synthea execution failed: ${error.message}`));
            }
            console.log('Synthea Output:', stdout);
            if (stderr) console.warn('Synthea Warning: ${stderr}');

    
        // locate the generated patient file
        const fhirOutputPath = path.join(__dirname, '../../synthea/output/fhir');
        fs.readdir(fhirOutputPath, (err, files) => {
            if (err) {
                return reject(new Error('failed to read synthea output directory'));
            }

            const jsonFiles = files.filter((file) => file.endsWith('.json'));
            if (jsonFiles.length === 0) {
                return reject(new Error('no JSON files found in synthea output'));
            }
            const patientFile = path.join(fhirOutputPath, jsonFiles[0]);
            fs.readFile(patientFile, "utf8", (err, data) => {
                if (err) {
                    return reject(new Error('failed to read patient file'));
                }

                const fhirData = JSON.parse(data);
                const fhirPatientId = fhirData.entry[0].resource.id;
                resolve({ fhirPatientId, fhirData });
            });
        });
    });
});
};

const authenticateUser = async (data) => {
    try {
        const { email, password } = data;
        const fetchedUser = await User.findOne({ email });
        if (!fetchedUser) {
            throw Error('User with provided email does not exist');
        }

        const hashedPassword = fetchedUser.password;
        const passwordMatch = await verifyHashdata(password, hashedPassword);

        if (!passwordMatch) {
            throw Error('Incorrect password');
        }

        // create token
        const tokenData = { email: fetchedUser.email, userId: fetchedUser._id };
        const token = await createToken(tokenData);

        // assign token to user
        fetchedUser.token = token;
        return fetchedUser;
    } catch (error) {
        throw Error(error.message);
    }
};

// when a new user registers, create a new user in the database and a synthea patient
// 1. check if patient already exists
// 2. generate a new synthea patient
// 3. extract FHIR ID from patient data
// 4. store patient data in MongoDB FHIR server
// 5. store the FHIR patient ID in the user document
// 6. hash the password
const createNewUser = async (data) => {
    try {
        const { name, email, password } = data;

        // check if all values are provided
        if (!name || !email || !password) {
            throw new Error('All input is required');
        }
        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error('User with provided email already exists');
        } 

        // generate a new synthea patient
        const { fhirPatientId, patientData } = await generateSyntheaPatient({ name });
        console.log('fhirPatientId:', fhirPatientId);

        // store patient data in MongoDB FHIR server
        await fetch(FHIR_SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patientData),
        });

        // hash password for encryption
        const hashedPassword = await hashData(password);

        // create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            fhirId: fhirPatientId,
        });

        // save user
        await newUser.save();

        // extract and store medications
        console.log(newUser.fhirId);
        console.log(fhirPatientId);
        const medications = await extractMedication({ fhirId: newUser.fhirId });
        console.log('medications:', medications);
        if (medications) {
            console.log(newUser._id);
            console.log(newUser.fhirId);
            await addMedication({ userId: newUser._id, fhirId: newUser.fhirId, medications: medications });
        }
        
    }
    catch (error) {
        console.error('signup error:', error);
        throw new Error(error.message);
    }
};

module.exports = { createNewUser, authenticateUser };
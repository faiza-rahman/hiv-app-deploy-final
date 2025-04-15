const express = require("express");
const router = express.Router();

const userRoutes = require("./domains/user/routes");
const symptomRoutes = require("./domains/symptom/routes");
const medicationRoutes = require("./domains/medication/routes");
const moodRoutes = require("./domains/mood/routes");


router.use('/user', userRoutes);
router.use('/symptom', symptomRoutes);
router.use('/medication', medicationRoutes);
router.use('/mood', moodRoutes);



module.exports = router;
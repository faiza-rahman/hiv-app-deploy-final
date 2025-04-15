const express = require('express');
const router = express.Router();
const { logMood, getWeeklyMood } = require("./controller");

router.post("/log", logMood);
router.get("/weekly/:userId", getWeeklyMood);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getSymptomLogs, saveSymptomLog } = require('./controller');

router.get('/:userId', getSymptomLogs); // get last 4 logs for a user
router.post('/', saveSymptomLog); // save or update a symptom log

module.exports = router;
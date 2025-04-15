const SymptomLog = require("./model");

// get last 4 logs
exports.getSymptomLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const logs = await SymptomLog.find({ userId }).sort({ date: -1 }).limit(5);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// save or update a symptom log
exports.saveSymptomLog = async (req, res) => {
    try {
        const { userId, date, symptoms } = req.body;

        let log = await SymptomLog.findOne({ userId, date });
        if (log) {
            // update existing log
            log.symptoms = symptoms;
            await log.save();
        } else {
            // create new log
            log = new SymptomLog({ userId, date, symptoms });
            await log.save();
        }
        res.json({ success: true, log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


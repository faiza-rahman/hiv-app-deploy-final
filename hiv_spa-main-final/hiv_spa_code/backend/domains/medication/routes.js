const express = require('express');
const router = express.Router();
const { getMedications, addMedication } = require('./controller');

router.get('/:userId', async (req, res) => {
    try {
        const medications = await getMedications({ userId: req.params.userId });
        res.json(medications);
    } catch (error) {
        console.error("Error fetching medications:", error);
        res.status(500).send("Error fetching medications");
    }
});

module.exports = router;
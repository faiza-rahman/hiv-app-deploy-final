const express = require('express');
const router = express.Router();
const { createNewUser, authenticateUser } = require('./controller');

// singin
router.post('/login', async (req, res) => {
    console.log("Request Body:", req.body);
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!(email && password)) {
            throw Error('All input is required');
        }
        
        const authenticatedUser = await authenticateUser({ email, password });
        res.status(200).json(authenticatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// signup
router.post('/signup', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        name = name.trim();
        email = email.trim();
        password = password.trim();


        if (!(name && email && password)) {
            throw Error ('All input is required');
        } else if (!/^[a-zA-Z ]*$/.test(name)) {
            throw Error ('Name must contain only letters');
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            throw Error ('Invalid email');
        } else if (password.length < 8) {
            throw Error ('Password must be at least 8 characters');
        } else {
            // good input, create user
            const newUser = await createNewUser({ name, email, password });
            res.status(200).json({ message: 'User created successfully', data: newUser });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
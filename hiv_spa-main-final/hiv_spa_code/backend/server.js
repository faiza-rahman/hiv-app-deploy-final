const express = require('express'); // Importing express
const app = express(); // Creating an express app
const mongoose = require("mongoose");
//const bodyParser = express.json;
const cors = require("cors");
const routes = require("./routes");
const dotenv = require('dotenv');
dotenv.config();
uri = process.env.MONGODB_URI

mongoose
.connect(uri)
.then(() => console.log("Connected to db"))
.catch((error) => console.error(error))

app.use(cors());
app.use(express.json());
app.use("/api", routes);

// Create a route that sends a response when visiting the homepage
app.get('/', (req, res) => {
  res.send('<h1>Hello, Express.js Server!</h1>');
});

// Create a route that sends a response when visiting the homepage
app.get('/api/login', (req, res) => {
  res.send('<h1>Hello, login.js Server!</h1>');
});

app.get('/api/signup', (req, res) => {
  res.send('<h1>Hello, signup.js Server!</h1>');
});
/*
app.get('/login', (req, res) => {
  res.send('This is the login page');
});

app.get('/signup', (req, res) => {
  res.send('This is the signup page');
});

app.get('/dashboard', (req, res) => {
  res.send('This is the dashboard');
});
*/
// Set up the server to listen on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
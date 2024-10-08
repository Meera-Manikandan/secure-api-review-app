require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute.js');
const saucesRoute = require('./routes/saucesRoute.js');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;
app.use(cors({ origin: "http://localhost:4200" }));

app.get('/', (req, res) => {
    res.send('Hello - Hot Takes!');
})

// Importing Routes to express app
app.use('/api/auth', userRoute);
app.use('/api/sauces', saucesRoute);

// Initialize mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});
// mongodb connection init block ends

app.listen(port, () => {
    console.log(`API Server app listening on port ${port}`);
})
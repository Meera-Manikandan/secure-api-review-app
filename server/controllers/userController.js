const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT
//const JWT_SECRET = '12wsfzxbfrhj@';
const JWT_SECRET = process.env.JWT_SECRET;

// Sign Up a new user
const signUp = async (req, res) => {
    if (!req.body.email && !req.body.password) {
        res.status(400).send({ message: "All fields are required!" });
    }
    const user = new UserModel({
        email: req.body.email,
        password: req.body.password
    });

    await user.save().then(data => {
        res.send({
            message: "User signup completed successfully!!",
            email: data.email
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating user"
        });
    });
};


// Login an existing user
const login = async (req, res) => {

    console.log('Call reached up to login in controller');
    if (!req.body.email && !req.body.password) {
        res.status(400).send({ message: "All fields are required!" });
    }
    console.log('Login request for email -', req.body.email);
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        else {

            // Check if the stored password is matching with user entered password
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

            // Send the userId and token in the response
            return res.status(200).json({ userId: user._id, token: token, message: 'Login Successful!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    signUp,
    login
};
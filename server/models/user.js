var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Before saving the user, hash the password if it's new or modified
schema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcryptjs');
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

var user = new mongoose.model('User', schema);
module.exports = user;
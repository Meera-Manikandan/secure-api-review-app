var mongoose = require('mongoose');
var saucesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    mainPepper: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: false
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    usersLiked: [{
        type: String
    }],
    usersDisliked: [{
        type: String
    }],
});

var sauces = new mongoose.model('Sauces', saucesSchema);
module.exports = sauces;
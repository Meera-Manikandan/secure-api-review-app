const mongoose = require('mongoose');

const saucesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainPepper: {
        type: String,
        required: true
    },
    heat: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,  // Number of likes
        default: 0
    },
    dislikes: {
        type: Number,  // Number of dislikes
        default: 0
    },
    usersLiked: {
        type: [String],  // Array of user IDs who liked the sauce
        default: []
    },
    usersDisliked: {
        type: [String],  // Array of user IDs who disliked the sauce
        default: []
    },
    userId: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,  // Storing the base64-encoded image string
        required: false
    },
    imageMimeType: {
        type: String,  // Storing the MIME type (e.g., 'image/jpeg' or 'image/png')
        required: false
    }
});

const Sauces = mongoose.model('Sauces', saucesSchema);
module.exports = Sauces;

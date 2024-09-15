const saucesModel = require('../models/sauces');

// Create a new sauce 
const createSauces = async (req, res) => {
    console.log('Call reached up to create sauces in controller');
    console.log('Request Body', req.body);
    // if (!req.body.name && !req.body.imageUrl) {
    //     res.status(400).send({ message: "Name and ImageUrl fields are required!" });
    // }
    // else {
    //TODO - Save Sauces
    const sauces = new saucesModel({
        name: req.body.name,
        imageUrl: req.body.imageUrl
    });
    await sauces.save().then(data => {
        res.send({
            message: "Sauces saved successfully!!",
            sauceId: data._id
        });
    }).catch(err => {
        res.send({
            message: err.message || "Some error occurred while creating user"
        });
    });
    // res.status(200).json({ message: 'Sauces created successfully' });
    // }
};

module.exports = {
    createSauces
};
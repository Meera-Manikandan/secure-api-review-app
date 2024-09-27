const saucesModel = require('../models/sauces');

// Create a new sauce 
const createSauces = async (req, res) => {
    console.log('Call reached up to create sauces in controller');
    console.log('Request Body', req.body);

    // Access and parse the 'sauce' JSON field
    const sauceData = req.body.sauce;
    const sauce = JSON.parse(sauceData);

    // Access the uploaded image file from memory
    const imageFile = req.file;

    // Convert the image to base64 or keep it as a buffer (for binary storage)
    const imageBuffer = imageFile ? imageFile.buffer : null;
    const base64Image = imageFile ? imageBuffer.toString('base64') : null;

    // Log the parsed sauce data
    console.log(`Received Sauce Data:`);
    console.log(`Name: ${sauce.name}`);
    console.log(`Manufacturer: ${sauce.manufacturer}`);
    console.log(`Description: ${sauce.description}`);
    console.log(`Main Pepper: ${sauce.mainPepper}`);
    console.log(`Heat Level: ${sauce.heat}`);
    console.log(`User ID: ${sauce.userId}`);

    if (base64Image) {
        console.log(`Base64 Image: ${base64Image.substring(0, 100)}...`);
    } else {
        console.log('No image uploaded');
    }

    const sauces = new saucesModel({
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.sauce,
        heat: sauce.heat,
        userId: sauce.userId,
        imageUrl: base64Image
    });
    await sauces.save().then(data => {
        res.send({
            message: "Sauces saved successfully!!",
            sauceId: data._id
        });
    }).catch(err => {
        res.send({
            message: err.message || "Some error occurred while creating sauces"
        });
    });
};

const getAllSauces = async (req, res) => {
    console.log('Call reached up to get sauces in controller');
    try {
        const sauces = await saucesModel.find();

        if (!sauces || sauces.length === 0) {
            return res.status(404).json({ message: 'Sauces array is empty' });
        } else {

            const formattedSauces = sauces.map(sauce => ({
                ...sauce._doc,
                imageUrl: `data:image/jpeg;base64,${sauce.imageUrl}`
            }));


            return res.status(200).json(formattedSauces);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSauces,
    getAllSauces
};
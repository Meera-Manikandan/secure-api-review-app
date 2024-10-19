const saucesModel = require('../models/sauces');

// Create a new sauce 
const createSauces = async (req, res) => {
    try {
        console.log('Call reached up to create sauces in controller');
        const sauceData = req.body.sauce;
        const sauce = JSON.parse(sauceData);

        // Access the uploaded image file from memory
        const imageFile = req.file;

        // Check if an image is uploaded and convert it to base64
        let base64Image = null;
        let imageMimeType = null;
        if (imageFile) {
            imageMimeType = imageFile.mimetype; // Save MIME type
            base64Image = imageFile.buffer.toString('base64'); // Convert image to base64
        }

        const sauces = new saucesModel({
            name: sauce.name,
            manufacturer: sauce.manufacturer,
            description: sauce.description,
            mainPepper: sauce.mainPepper,
            heat: sauce.heat,
            userId: sauce.userId,
            imageUrl: base64Image,  // Store base64 image
            imageMimeType: imageMimeType  // Store MIME type
        });

        const savedSauce = await sauces.save();
        res.status(201).send({
            message: "Sauce saved successfully!!",
            sauceId: savedSauce._id
        });
    } catch (err) {
        console.error('Error creating sauce:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the sauce."
        });
    }
};

const updateSauce = async (req, res) => {
    try {
        const sauceId = req.params.id;  // Get the sauce ID from URL params
        console.log(`Call reached to update sauce with ID: ${sauceId}`);

        // Determine if the incoming data is in formData or JSON format
        let sauceData;
        let base64Image = null;
        let imageMimeType = null;

        // Check if image file is present
        const imageFile = req.file;

        // If using FormData
        if (imageFile) {
            // Access and parse the 'sauce' field from the request body
            sauceData = req.body.sauce;
            if (typeof sauceData === 'string') {
                sauceData = JSON.parse(sauceData); // Parse if it's a stringified object
            }

            // Handle image upload
            imageMimeType = imageFile.mimetype; // Save MIME type
            base64Image = imageFile.buffer.toString('base64'); // Convert image to base64
        } else {
            // If not using FormData, assume JSON
            sauceData = req.body;
            // No image upload, but keep image fields intact
        }

        // Find the existing sauce and update the fields
        const updatedSauce = await saucesModel.findByIdAndUpdate(
            sauceId,
            {
                name: sauceData.name,
                manufacturer: sauceData.manufacturer,
                description: sauceData.description,
                mainPepper: sauceData.mainPepper,
                heat: sauceData.heat,
                userId: sauceData.userId,
                ...(base64Image && { imageUrl: base64Image, imageMimeType: imageMimeType }) // Update image if provided
            },
            { new: true }  // Return the updated sauce document
        );

        if (!updatedSauce) {
            return res.status(404).json({ message: "Sauce not found" });
        }

        res.status(200).json({ message: "Sauce updated successfully", updatedSauce });
    } catch (err) {
        console.error('Error updating sauce:', err);
        res.status(500).json({ message: 'Server error during sauce update' });
    }
};


const deleteSauce = async (req, res) => {
    try {
        const sauceId = req.params.id;

        // Find the sauce by ID and delete it
        const deletedSauce = await saucesModel.findByIdAndDelete(sauceId);
        
        if (!deletedSauce) {
            return res.status(404).json({ message: 'Sauce not found.' });
        }

        res.status(200).json({ message: 'Sauce deleted successfully!' });
    } catch (err) {
        console.error('Error deleting sauce:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};


const getAllSauces = async (req, res) => {
    try {
        const sauces = await saucesModel.find();

        if (!sauces || sauces.length === 0) {
            return res.status(404).json({ message: 'No sauces found.' });
        }

        const formattedSauces = sauces.map(sauce => {
            let imageUrl = null;

            // Construct data URI for the image if it exists
            if (sauce.imageUrl && sauce.imageMimeType) {
                imageUrl = `data:${sauce.imageMimeType};base64,${sauce.imageUrl}`;
            }

            return {
                ...sauce._doc,
                imageUrl: imageUrl // Dynamically constructed image URL or null
            };
        });

        return res.status(200).json(formattedSauces);
    } catch (err) {
        console.error('Error fetching sauces:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getSauceById = async (req, res) => {
    try {
        const sauceId = req.params.id;

        // Find the sauce by its ID
        const sauce = await saucesModel.findById(sauceId);

        if (!sauce) {
            return res.status(404).json({ message: 'Sauce not found.' });
        }

        let imageUrl = null;

        // Construct data URI for the image if it exists
        if (sauce.imageUrl && sauce.imageMimeType) {
            imageUrl = `data:${sauce.imageMimeType};base64,${sauce.imageUrl}`;
        }

        // Format the sauce with the image
        const formattedSauce = {
            ...sauce._doc,
            imageUrl: imageUrl // Dynamically constructed image URL or null
        };

        return res.status(200).json(formattedSauce);
    } catch (err) {
        console.error('Error fetching sauce by ID:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Controller to like a sauce
const likeSauce = async (req, res) => {
    try {
        const sauceId = req.params.id;
        const userId = req.body.userId; // Assuming the user's ID is passed in the request body

        const sauce = await saucesModel.findById(sauceId);
        if (!sauce) {
            return res.status(404).json({ message: 'Sauce not found.' });
        }

        // Check if user has already liked the sauce
        if (!sauce.usersLiked.includes(userId)) {
            sauce.likes += 1;
            sauce.usersLiked.push(userId);

            // Remove the user from usersDisliked if they had disliked before
            if (sauce.usersDisliked.includes(userId)) {
                sauce.dislikes -= 1;
                sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
            }
        }

        const updatedSauce = await sauce.save();
        return res.status(200).json(updatedSauce);
    } catch (err) {
        console.error('Error liking sauce:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to dislike a sauce
const dislikeSauce = async (req, res) => {
    try {
        const sauceId = req.params.id;
        const userId = req.body.userId; // Assuming the user's ID is passed in the request body

        const sauce = await saucesModel.findById(sauceId);
        if (!sauce) {
            return res.status(404).json({ message: 'Sauce not found.' });
        }

        // Check if user has already disliked the sauce
        if (!sauce.usersDisliked.includes(userId)) {
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);

            // Remove the user from usersLiked if they had liked before
            if (sauce.usersLiked.includes(userId)) {
                sauce.likes -= 1;
                sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
            }
        }

        const updatedSauce = await sauce.save();
        return res.status(200).json(updatedSauce);
    } catch (err) {
        console.error('Error disliking sauce:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createSauces,
    updateSauce,
    deleteSauce,
    getAllSauces,
    getSauceById,
    likeSauce,
    dislikeSauce
};

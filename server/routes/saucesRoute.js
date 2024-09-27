const express = require('express');
const multer = require('multer');
const saucesController = require('../controllers/saucesController');
const router = express.Router();

// Use memory storage to avoid saving the image to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), saucesController.createSauces);
router.get('/', saucesController.getAllSauces);

module.exports = router;

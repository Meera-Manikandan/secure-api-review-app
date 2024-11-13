const express = require('express');
const multer = require('multer');
const saucesController = require('../controllers/saucesController');
const checkToken = require('../middleware/checkToken'); // import middleware
const router = express.Router();

// Use memory storage to avoid saving the image to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), saucesController.createSauces);
router.put('/:id', upload.single('image'), saucesController.updateSauce);
router.delete('/:id', checkToken, saucesController.deleteSauce);  
router.get('/', checkToken, saucesController.getAllSauces);
router.get('/:id', checkToken,saucesController.getSauceById);
router.post('/:id/like', checkToken, saucesController.likeSauce);
router.post('/:id/dislike', checkToken, saucesController.dislikeSauce);

module.exports = router;

const express = require('express');
const saucesController = require('../controllers/saucesController');
const router = express.Router();
router.post('/', saucesController.createSauces);

module.exports = router;

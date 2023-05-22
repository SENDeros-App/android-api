const express = require('express');
const router = express.Router();

const AlertController = require('../../controllers/api/Alert');

router.get('/all', AlertController.findAll);

module.exports = router;
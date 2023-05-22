const express = require('express');
const router = express.Router();

const AlertTypeController = require('../../controllers/api/AlertType');

router.post('/', AlertTypeController.create);

router.get('/', AlertTypeController.findAll);

router.delete('/delete/:_id', AlertTypeController.deleteOneByID);

router.get('/details/:_id', AlertTypeController.findOneByID);

module.exports = router;
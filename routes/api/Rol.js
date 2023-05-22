const express = require('express');
const router = express.Router();

const RolController = require('../../controllers/api/Rol');

router.post('/', RolController.create);

router.get('/all', RolController.findAll);

router.delete('/delete/:_id', RolController.deleteOneByID);

router.put('/:_id', RolController.updateByID);

module.exports = router;
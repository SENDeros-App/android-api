const express = require('express');
const router = express.Router();

const AlertController = require('../../controllers/api/Alert');


//var upload = multer({ dest: 'uploads/'})

//RUTAS 

router.post('/', AlertController.create);

router.get('/', AlertController.findAll);

router.get('/type/:type', AlertController.findOneByID);

router.get('/type/:type', AlertController.findByType);

router.get('/user', AlertController.findByUser);

router.delete('/:_id', AlertController.deleteOneByID);

router.get('/near', AlertController.filterByProximity);

module.exports = router;
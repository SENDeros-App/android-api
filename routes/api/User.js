
const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/api/Users');

//to do;  si se cambia la contra el token antigua sigue siendo valido
router.get('/', UserController.getUser);

router.get('/top/:n', UserController.getTopN);

router.get('/profile/:_id', UserController.getProfile);

router.get('/myrank', UserController.getRankByUserId)

router.put('/', UserController.updateByID);

module.exports = router;
const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middlewares/Auth');

const AuthRouter = require('./api/Auth');
const UserRouter = require('./api/User');
const AlertRouter = require('./api/Alert');
const AlertTypeRouter = require('./api/AlertType');
const RolRouter = require('./api/Rol');
//const { findAll } = require('./api/Alert');
const NonAuthAlertRouter = require('./api/NonAuthAlert');

router.use('/auth', AuthRouter);

router.use('/alert', AuthMiddleware.verifyAuth, AlertRouter);

router.use('/user', AuthMiddleware.verifyAuth, UserRouter);

router.use('/alertType', AuthMiddleware.verifyAuth, AlertTypeRouter);

router.use('/rol', AuthMiddleware.verifyAuth, RolRouter);

router.use('/nonauth/alert', NonAuthAlertRouter);

module.exports = router;
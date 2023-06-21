const UserService = require('./../../services/User');
const TokenModel = require('./../../models/Token')
const { createToken } = require('../../utils/JWTUtils');
const { generateRandomNumber } = require('../../utils/randomNumber');
const sendEmail = require("../../utils/email/sendEmail");
const bcrypt = require("bcrypt");
const service = require('./../../services/User');
const Alert = require('../../models/Alert');

const bcryptSalt = process.env.BCRYPT_SALT || 10;
const tokenExpiration = process.env.TOKEN_EXPIRATION || 600;
const codeLength = process.env.RECOVERY_CODE_LENGTH || 6;

const controller = {};

controller.register = async (req, res) => {
	//pasa los regex y valida los datos
	const fieldValidation = UserService.verifyRegisterFields(req.body);
	if (!fieldValidation.success) {
		return res.status(400).json(fieldValidation.content);
	}
	try {
		const { username, email } = req.body;
		//const photo = req.file.path;
		//verifica si existe 
		const userExists = await UserService.findOneByUsername(username);
		if (userExists.success) {
			return res.status(409).json({
				error: 'Usuario ya registrado '
			});
		}

		const emailExists = await UserService.findOneByEmail(email);
		if (emailExists.success) {
			return res.status(409).json({
				error: 'email ya registrado '
			});
		}
		//registra
		const userRegistered = await UserService.register(req.body);

		if (!userRegistered.success) {
			return res.status(409).json(userRegistered.content);
		}
		return res.status(201).json(userRegistered.content);
	} catch (e) {
		return res.status(409).json({
			error: 'telefonico ya registrado'
		});
	}
};

controller.login = async (req, res) => {
	const fieldValidation = UserService.verifyLoginFields(req.body);
	if (!fieldValidation.success) {
		return res.status(400).json(fieldValidation.content);
	}

	try {
		const { identifier, password } = req.body;
		//buscar por email o usernme
		const userExists = await UserService.findOneByUsernameEmail(identifier, identifier);
		if (!userExists.success) {
			return res.status(404).json(userExists.content);
		}

		const user = userExists.content;

		if (!user.comparePassword(password)) {
			return res.status(401).json({
				error: 'Contraseña incorrecta'
			});
		}

		const token = createToken(user._id);

		const tokenRegistered = await UserService.registerToken(user, token);
		if (!tokenRegistered.success) {
			return res.status(409).json(tokenRegistered.content);
		}
		//retorna el token 
		return res.status(200).json({
			msg:"Inicio de sesión exitoso",
			token: token,
			user: {
				name: user.username,
				division: user.rank
			}
			
		});		
	} catch (error) {
		return res.status(500).json({
			error: 'Internal server error'

		});
	}
};

controller.requestPasswordReset = async (req, res) => {
	if(!req.body.hasOwnProperty('identifier')){
		return res.status(400).json({
			message: 'El body debe incluir el parametro identifier'
		});
	}

	const { identifier } = req.body;

	let serviceResponse = {
		success: true,
		content: {
			message: 'Correo con código de confirmación enviado exitosamente'
		}
	};

	try {
		const user = (await UserService.findOneByEmailOrUsername(identifier, identifier)).content;

		console.log(user);

		if(user.message === 'User not found') {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'Usuario no encontrado'
			};
			return res.status(404).json(serviceResponse);
		}

		let token = await TokenModel.findOne({ userId: user._id });
		if (token) {
			await token.deleteOne()
		};

		let resetToken = generateRandomNumber(codeLength);
		const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

		const savedToken = await new TokenModel({
			userId: user._id,
			token: hash,
			createdAt: Date.now(),
		}).save();

		if (!savedToken) {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'Error interno, no fue posible guardar el código de recuperación'
			};
			return res.status(409).json(serviceResponse);
		}

		const tokenExpInMin = tokenExpiration/60;

		//console.log(tokenExpInMin);

		sendEmail(
			user.email,
			"Solicitud para restablecer tu contraseña",
			{
				name: user.name,
				token: resetToken,
				tokenExp: (tokenExpInMin)
			},
			"./template/requestResetPassword.handlebars"
		);

		return res.status(200).json(serviceResponse);
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			error: 'Internal Server Error (Controller)'
		});
	}
}

controller.verifyResetToken = async (req, res) => {
	if(!req.body.hasOwnProperty('identifier') || !req.body.hasOwnProperty('token')){
		return res.status(400).json({
			message: 'El body debe incluir los siguientes parametros: identifier, token'
		});
	}

	let serviceResponse = {
		success: true,
		content: {
			message: 'Contraseña modificada exitosamente'
		}
	};

	const { identifier, token} = req.body;
	try{

		const userFound = (await UserService.findOneByEmailOrUsername(identifier, identifier)).content;

		if (userFound.message === 'User not found') {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'Usuario no encontrado'
			};
			return res.status(404).json(serviceResponse);
		}

		const userId = userFound._id;

		let passwordResetToken = await TokenModel.findOne({ userId: userId });

		if (!passwordResetToken) {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'No se encontró código de recuperación relacionado al usuario proporcionado'
			};
			return res.status(404).json(serviceResponse);
		}

		const isValid = await bcrypt.compare(token, passwordResetToken.token);

		if (!isValid) {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'Código proporcionado no es igual al generado'
			};
			return res.status(404).json(serviceResponse);
		}

		serviceResponse.content = {
			message: 'Usuario y código son validos'
		};

		return res.status(200).json(serviceResponse);
	}catch(error){
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
}

controller.resetPassword = async (req, res) => {
	if(!req.body.hasOwnProperty('identifier') || !req.body.hasOwnProperty('token') || !req.body.hasOwnProperty('password')){
		return res.status(400).json({
			message: 'El body debe incluir los siguientes parametros: identifier, token, password'
		});
	}

	let serviceResponse = {
		success: true,
		content: {
			message: 'Contraseña modificada exitosamente'
		}
	};

	const { identifier, token, password } = req.body;

	try {
		
		const userFound = (await UserService.findOneByEmailOrUsername(identifier, identifier)).content;

		if (userFound.message === 'User not found') {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'Usuario no encontrado'
			};
			return res.status(404).json(serviceResponse);
		}

		const userId = userFound._id;
		
		let passwordResetToken = await TokenModel.findOne({ userId: userId });

		if (!passwordResetToken) {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'No se encontró código de recuperación relacionado al usuario proporcionado'
			};
			return res.status(404).json(serviceResponse);
		}

		const isValid = await bcrypt.compare(token, passwordResetToken.token);

		if (!isValid) {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'Código proporcionado no es igual al generado'
			};
			return res.status(404).json(serviceResponse);
		}

		const user = (await UserService.updatePasswordByUserId(userId, password)).content;

		sendEmail(
			user.email,
			"Contraseña actualizada exitosamente",
			{
				name: user.name,
			},
			"./template/resetPassword.handlebars"
		);

		await passwordResetToken.deleteOne();

		return res.status(200).json(serviceResponse);

	} catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

module.exports = controller;
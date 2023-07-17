
const UserModel = require('../models/User');
const AlertModel = require('../models/Alert');

const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,32})');
const emailRegex = new RegExp('^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$');
const phoneNumberRegex = new RegExp('^[0-9]{8}$');
const service = {};

service.verifyRegisterFields = ({ username, email, password, name, phoneNumber }) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	if (!username || !email || !password || !name || !phoneNumber) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Required fields empty'
			}
		};

		return serviceResponse;
	}

	if (!emailRegex.test(email)) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Email format incorrect'
			}
		};

		return serviceResponse;
	}

	if (!phoneNumberRegex.test(phoneNumber)) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Phone number format incorrect'
			}
		};

		return serviceResponse;
	}

	if (!passwordRegex.test(password)) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Password must be 8-32 and strong'
			}
		};

		return serviceResponse;
	}

	return serviceResponse;
};

service.verifyUpdatePasswordField = ({ password }) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	if (!passwordRegex.test(password)) {
		serviceResponse.success = false;
		serviceResponse.content.push({
			content: 'Password must be 8-32 and strong'
		})

		return serviceResponse;
	}

	return serviceResponse;
}

//Ve que no esten vacios 
service.verifyLoginFields = ({ identifier, password }) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	if (!identifier || !password) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Require fields empty'
			}
		};

		return serviceResponse;
	}

	return serviceResponse;
};

service.register = async ({ username, email, password, name, phoneNumber }) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'User registered'
		}
	};

	try {
		const user = new UserModel({
			username,
			email,
			password,
			name,
			phoneNumber
		});

		const userSaved = await user.save();
		if (!userSaved) {
			serviceResponse = {
				success: false,
				content: {
					message: 'User not registered'
				}
			};
		}

		return serviceResponse;
	} catch (e) {
		console.log(e);
		throw new Error('Internal Server Error');
	}
};

//encontrar usuario por email o username y lo devuelve 
service.findOneByUsernameEmail = async (username, email) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const user = await UserModel.findOne({
			$or: [{ username: username }, { email: email }]
		}).exec();

		if (!user) {
			serviceResponse = {
				success: false,
				content: {
					error: 'User not found!'
				}
			};
		} else {
			serviceResponse.content = user;
		}

		return serviceResponse;
	} catch (e) {
		throw new Error('Internal server error');
	}
};
//encontrar usuario por username y lo devuelve 
service.findOneByUsername = async (username) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const user = await UserModel.findOne({
			$or: [{ username: username }]
		}).exec();

		if (!user) {
			serviceResponse = {
				success: false,
				content: {
					error: 'User not found!'
				}
			};
		} else {
			serviceResponse.content = user;
		}

		return serviceResponse;
	} catch (e) {
		throw new Error('Internal server error');
	}
};
//encontrar usuario por email y lo devuelve 
service.findOneByEmail = async (email) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const user = await UserModel.findOne({
			$or: [{ email: email }]
		}).exec();

		if (!user) {
			serviceResponse = {
				success: false,
				content: {
					error: 'email not found!'
				}
			};
		} else {
			serviceResponse.content = user;
		}

		return serviceResponse;
	} catch (e) {
		throw new Error('Internal server error');
	}
};

service.findOneByID = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const user = await UserModel.findById(_id).select('-hashedPassword').exec();

		if (!user) {
			serviceResponse = {
				success: false,
				content: {
					error: 'User not found!'
				}
			};
		} else {
			serviceResponse.content = user;
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

service.findOneByEmailOrUsername = async (emailToFind, usernameToFind) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const user = await UserModel.findOne(
				{$or: [{ username: usernameToFind }, { email: emailToFind }]}
			).select('-hashedPassword').exec();

		if (!user) {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'User not found'
			};

			return serviceResponse;
		} else {
			serviceResponse.content = user;
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

service.verifyUpdateFields = ({ username, email, password, name }) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	if (!username && !email && !password && !name) {
		serviceResponse = {
			success: false,
			content: {
				error: 'All fields are empty'
			}
		};
		return serviceResponse;
	}

	if (username) serviceResponse.content.username = username;

	if (email) {
		if (!emailRegex.test(email)) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Field format incorrect'
				}
			};
			return serviceResponse;
		}
		serviceResponse.content.email = email;
	}

	if (password) {
		if (!passwordRegex.test(password)) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Password must be 8-32 and strong'
				}
			};
			return serviceResponse;
		}

		serviceResponse.content.password = password;
	}

	if (name) serviceResponse.content.name = name;
	//if (photo) serviceResponse.content.photo = photo;

	return serviceResponse;
};

service.updateByID = async (user, contentToUpdate) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'User updated'
		}
	};

	try {
		Object.keys(contentToUpdate).forEach((key) => {
			user[key] = contentToUpdate[key];
		});

		const userUpdated = await user.save();

		if (!userUpdated) {
			serviceResponse = {
				success: false,
				content: {
					error: 'User not updated'
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

//pushea el token al user al hacer login
service.registerToken = async (user, token) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Token registered'
		}
	};
	try {
		user.validTokens.push(token);

		const userUpdated = await user.save();
		if (!userUpdated) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Token not registered '
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

service.getTopNUsersWithMostAlerts = async (n) => {
	let serviceResponse = {
		success: true,
		content: {}
	};
	limit = n || 5;
	try {
		const users = await UserModel.find().populate({
			path: 'savedAlerts',
			select: 'user'
		});

		const userAlertsCount = users.map(user => ({
			username: user.username,
			alertsCount: user.savedAlerts.length
		}));

		const topNUsers = userAlertsCount.sort((a, b) => b.alertsCount - a.alertsCount).slice(0, limit);
		serviceResponse.content = topNUsers;

		return serviceResponse;
	} catch (err) {
		// Maneja el error
		console.error(err);
		throw new Error('No se pudo obtener el top 10 de usuarios con más alertas');
	}
}

service.getUserRankByUserId = async (userID) => {
	let serviceResponse = {
		success: true,
		content: {}
	}
	try{

		const user = await UserModel.findById(userID).select('username rank').exec();

		if (!user) {
			serviceResponse.success = false;
			serviceResponse.content = {
				message: 'User not found'
			};

			return serviceResponse;
		} else {
			serviceResponse.content = user;
		}

		return serviceResponse;
	}catch{
		console.error(err);
		throw new Error('No se pudo obtener el rango del usuario actual');
	}
}

service.updatePasswordByUserId = async (userID, newPassword) => {

	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const userUpdated = await UserModel.findById(userID).exec();

		const updatedUser = await userUpdated.updatePassword(newPassword);

		serviceResponse.content = updatedUser;

		if (!userUpdated) {
			serviceResponse.success = false;
			serviceResponse.content.push({
				message: 'Error interno, no fue posible actualizar la contraseña.'
			});
			return serviceResponse;
		}

		return serviceResponse;
	}catch(error){
		console.log(error);
		throw new Error('No se pudo actualizar la contraseña');
	}
}
module.exports = service;
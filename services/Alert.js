const AlertModel = require('../models/Alert');
const UserModel = require('../models/User');
const AlertTypeService = require('./AlertType');
const service = {};

//Verificacion
 service.verifyCreateFields = ({ latitud, longitud, type}) => {
    let serviceResponse = {
		success: true,
		content: {
			message: 'Alert created '
		}
	};
	
	if (!type) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Type is required'
			}
		};

		return serviceResponse;
	}

	if (!latitud) {
		serviceResponse = {
			success: false,
			content: {
				error: 'latitud is required'
			}
		};

		return serviceResponse;
	}

	if (!longitud) {
		serviceResponse = {
			success: false,
			content: {
				error: 'longitud is required'
			}
		};

		return serviceResponse;
	}

    return serviceResponse;
 };
    
 /**Crear alerta */

 service.create = async (latitud, longitud, typeID, userID) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Alert created succesfully'
		}
	};

	let myRank = '';

	try {
		const alertFound = await AlertTypeService.findOneByID(typeID);
		if(!alertFound){
			serviceResponse = {
				success: false,
				content: {
					error: 'AlertType not found'
				}
			};
			return serviceResponse;
		}

		const alert = new AlertModel({
			latitud,
			longitud,
			type: typeID,
			user: userID
		});

		const alertSaved = await alert.save();

		if (!alertSaved) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Alert not created'
				}
			};
		}

		const userPushedAlert = await UserModel.findByIdAndUpdate(
			userID,
			{ $push: { savedAlerts: alertSaved._id } },
			{ new: true }
		);

		const userAlertsCount = {
			username: userPushedAlert.username,
			alertsCount: userPushedAlert.savedAlerts.length
		}

		if(userAlertsCount.alertsCount > 5 && userAlertsCount.alertsCount < 15) {
			myRank = 'Medium';
		}
		else if(userAlertsCount.alertsCount >= 15){
			myRank = 'Pro';
		}else{
			myRank = userPushedAlert.rank;
		}


		const userPushedRank = await UserModel.findByIdAndUpdate(
			userID,
			{ rank: myRank },
			{ new: true }
		);
		
		return serviceResponse;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

//encontrar post por id 
service.findOneByID = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Alert Found'
		}
	};

	try {
		const alert = await AlertModel.findById(_id).populate('user', 'username _id').exec();

		if (!alert) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Alert not found'
				}
			};
		} else {
			serviceResponse.content = alert;
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};
/**Traer todas las alertas en funcion al idUSER */
service.findAllByUserID = async (userID) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const alerts = await AlertModel.find({ user: userID }).populate('user', 'username _id').exec();

		serviceResponse.content = alerts;

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

service.findAllByTypeID = async (typeID) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const alerts = await AlertModel.find({ type: typeID }).populate('user', 'username _id').exec();

		serviceResponse.content = alerts;

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

/**Encontrar todas las alertas */
service.findAll = async (page, limit) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const alerts = await AlertModel.find({}, undefined, {
			skip: page * limit,
			limit: limit,
			sort: [
				{
					createdAt: -1
				}
			]
		})
			.populate('user', 'username _id')
			//.populate({ path: 'type', select: 'name' })
			.exec();

		serviceResponse.content = {
			alerts,
			count: alerts.length,
			page,
			limit
		};

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

/**Elimianr una alerta por su id */
service.deleteOneByID = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Alert Deleted succesfully'
		}
	};

	try {
		const alertDeleted = await AlertModel.findByIdAndDelete(_id).exec();

		if (!alertDeleted) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Alert not deleted'
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw new Error('Internal Server Error');
	}
};
service.filterByProximity = async (lat, lon) => {
	let serviceResponse = {
		success: true,
		content: {}
	  };
	
	  try {
		const alerts = await AlertModel.find({ type: typeID }).populate('user', 'username _id').exec();
	
		serviceResponse.content = alerts;
	
		return serviceResponse;
	  } catch (error) {
		throw error;
	  }

}



module.exports = service;

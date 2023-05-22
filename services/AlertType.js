const AlertTypeModel = require('../models/AlertType');
const service = {};

service.verifyCreateFields = ({ name, description}) => {
    let serviceResponse = {
		success: true,
		content: {
			message: 'AlertType created'
		}
	};

	if (!name) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Name is required'
			}
		};

		return serviceResponse;
	}

	if (!description) {
		serviceResponse = {
			success: false,
			content: {
				error: 'Description is required'
			}
		};

		return serviceResponse;
	}
    return serviceResponse;
};
   
/**Crear typo de alerta */
service.create = async ({ name, description}) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'AlertType created succesfully'
		}
	};

	try {
		const alertType = new AlertTypeModel({
			name, 
            description,
		});

		const alertTypeSaved = await alertType.save();

		if (!alertTypeSaved) {
			serviceResponse = {
				success: false,
				content: {
					error: 'AlertType not created'
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

/**Encontrar todas las alertas Paginadas*/
service.findAll = async (page, limit) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const alertsType = await AlertTypeModel.find({}, undefined, {
			skip: page * limit,
			limit: limit,
			sort: [
				{
					createdAt: -1
				}
			]
		})
			.exec();

		serviceResponse.content = {
			alertsType,
			count: alertsType.length,
			page,
			limit
		};

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

/**Elimianr un tipo alerta por su id */
service.deleteOneByID = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'AlertType Deleted succesfully'
		}
	};

	try {
		const alertTypeDeleted = await AlertTypeModel.findByIdAndDelete(_id).exec();

		if (!alertTypeDeleted) {
			serviceResponse = {
				success: false,
				content: {
					error: 'AlertType not deleted'
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw new Error('Internal Server Error');
	}
};

service.findOneByID = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'AlertType Found'
		}
	};

	try {
		const alertType = await AlertTypeModel.findById(_id).exec();

		if (!alertType) {
			serviceResponse = {
				success: false,
				content: {
					error: 'AlertType not found'
				}
			};
		} else {
			serviceResponse.content = alertType;
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};
module.exports = service;
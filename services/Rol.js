const RolModel = require('../models/Rol');
const service = {};

service.verifyCreateFields = ({ name, description}) => {
    let serviceResponse = {
		success: true,
		content: {
			message: 'Rol created'
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

/**Verificar cuando se quiera modificar un rol */
service.verifyUpdateFields = ({ name, description}) => {
    let serviceResponse = {
		success: true,
		content: {
			message: 'Rol modificated'
		}
	};

	if (!name && !description) {
		serviceResponse = {
			success: false,
			content: {
                error: 'All fields are empty'
			}
		};

		return serviceResponse;
	}

	
	if(name) serviceResponse.content.name = name
    if(description) serviceResponse.content.description = description

    return serviceResponse;
};

/**Crear rol */
service.create = async ({ name, description}) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Rol created succesfully'
		}
	};

	try {
		const rol = new RolModel({
			name, 
            description,
		});

		const rolSaved = await rol.save();

		if (!rolSaved) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Rol not created'
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

/**Encontrar todos los roles Paginados*/
service.findAll = async (page, limit) => {
	let serviceResponse = {
		success: true,
		content: {}
	};

	try {
		const rols = await RolModel.find({}, undefined, {
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
			rols,
			count: rols.length,
			page,
			limit
		};

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

/**Elimianr un rol  por su id */
service.deleteOneByID = async (_id) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Rol Deleted succesfully'
		}
	};

	try {
		const rolDeleted = await RolModel.findByIdAndDelete(_id).exec();

		if (!rolDeleted) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Rol not deleted'
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw new Error('Internal Server Error');
	}
};

service.updateByID = async (rol, contentToUpdate) => {
	let serviceResponse = {
		success: true,
		content: {
			message: 'Rol updated'
		}
	};

	try {
		Object.keys(contentToUpdate).forEach((key) => {
			rol[key] = contentToUpdate[key];
		});

		const rolUpdated = await user.save();

		if (!rolUpdated) {
			serviceResponse = {
				success: false,
				content: {
					error: 'Rol not updated'
				}
			};
		}

		return serviceResponse;
	} catch (error) {
		throw error;
	}
};

module.exports = service;
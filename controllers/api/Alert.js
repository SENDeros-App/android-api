const AlertService = require('../../services/Alert');
const AlertTypeService = require('../../services/AlertType');
const { verifyID } = require('../../utils/MongoUtils');
const { verifyNumberType } = require('../../utils/MiscUtils');

const UserService = require('../../services/User');
const controller = {};

controller.create = async (req, res) => {
	const fieldsValidation = AlertService.verifyCreateFields(req.body);
	if (!fieldsValidation.success) {
		return res.status(400).json(fieldsValidation.content);
	}

	try {
		//console.log('Printing body: ', req.body);
		const { user } = req;
		if (!verifyID(req.body.type)) {
			return res.status(400).json({
				error: 'Error in AlertType ID'
			});
		}
		
		const createAlert = await AlertService.create(req.body.latitud, req.body.longitud, req.body.type , user._id);
		if (!createAlert.success) {
			return res.status(409).json(createAlert.content);
		}

		res.status(201).json(createAlert.content);
	} catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.findAll = async (req, res) => {
	const { page = 0, limit = 10 } = req.query;

	if (!verifyNumberType(page, limit)) {
		return res.status(400).json({
			error: 'Mistype in query'
		});
	}

	try {
		const alertResponse = await AlertService.findAll(parseInt(page), parseInt(limit));
		res.status(200).json(alertResponse.content);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

controller.findOneByID = async (req, res) => {
	const { _id } = req.params;

	if (!verifyID(_id)) {
		return res.status(400).json({
			error: 'Error in ID'
		});
	}

	try {
		const alertExists = await AlertService.findOneByID(_id);
		if (!alertExists.success) {
			return res.status(404).json(alertExists.content);
		}

		res.status(200).json(alertExists.content);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};


controller.deleteOneByID = async (req, res) => {
	const { _id } = req.params;

	if (!verifyID(_id)) {
		return res.status(400).json({
			error: 'Error in ID'
		});
	}

	try {
		const alertExists = await AlertService.findOneByID(_id);
		if (!alertExists.success) {
			return res.status(404).json(alertExists.content);
		}

		const deleted = await AlertService.deleteOneByID(_id);
		if (!deleted.success) {
			return res.status(500).json(deleted.content);
		}

		res.status(200).json(deleted.content);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

controller.findByUser = async (req, res) => {
	const { id = req.user._id } = req.query;

	if (!verifyID(id)) {
		return res.status(400).json({
			error: 'Error in ID'
		});
	}

	try {
		const userExists = await UserService.findOneByID(id);
		if (!userExists.success) {
			return res.status(404).json(userExists.content);
		}

		const alertByUser = await AlertService.findAllByUserID(id);
		return res.status(200).json(alertByUser.content);
	} catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.findByType = async (req, res) => {
	const { _id } = req.params;

	if (!verifyID(_id)) {
		return res.status(400).json({
			error: 'Error in ID'
		});
	}

	try {
		const typeExists = await AlertTypeService.findOneByID(_id);
		if (!typeExists.success) {
			return res.status(404).json(typeExists.content);
		}

		const alertByType = await AlertService.findAllByTypeID(_id);
		return res.status(200).json(alertByType.content);
	} catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.filterByProximity = async (req, res) => {
	const { lat = req.alert.latitud , lon = req.alert.longitud} = req.query;

	try {
		const alertasOrdenadas = await Alert.find({
		  ubicacion: {
			$near: {
			  $geometry: {
				type: 'Point',
				coordinates: [parseFloat(lon), parseFloat(lat)],
			  },
			},
		  },
		});
	
		res.json(alertasOrdenadas);
	  } catch (error) {
		res.status(500).json({ error: 'Error al filtrar las alertas por proximidad.' });
	  }


};






module.exports = controller;
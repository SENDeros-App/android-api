const AlertTypeService = require('../../services/AlertType');
const { verifyNumberType } = require('../../utils/MiscUtils');
const { verifyID } = require('../../utils/MongoUtils');

const controller = {};

controller.create = async (req, res) => {
	const fieldsValidation = AlertTypeService.verifyCreateFields(req.body);
	if (!fieldsValidation.success) {
		return res.status(400).json(fieldsValidation.content);
	}

	try {
		const createAlertType = await AlertTypeService.create(req.body);
		if (!createAlertType.success) {
			return res.status(409).json(createAlertType.content);
		}

		res.status(201).json(createAlertType.content);
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
		const alertTypeResponse = await AlertTypeService.findAll(parseInt(page), parseInt(limit));
		res.status(200).json(alertTypeResponse.content);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};

controller.deleteOneByID = async (req, res) => {
	const { _id } = req.params;

	if (!verifyID(_id)) {
		return res.status(400).json({
			error: 'AlertType in ID'
		});
	}
	
	try {
		const alertTypeExists = await AlertTypeService.findOneByID(_id);
		if (!alertTypeExists.success) {
			return res.status(404).json(alertTypeExists.content);
		}

		const deleted = await AlertTypeService.deleteOneByID(_id);
		if (!deleted.success) {
			return res.status(500).json(deleted.content);
		}

		res.status(200).json(deleted.content);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

controller.findOneByID = async (req, res) => {
	const { _id } = req.params;

	if (!verifyID(_id)) {
		return res.status(400).json({
			error: 'Error in Type ID'
		});
	}

	try {
		const alertTypeExists = await AlertTypeService.findOneByID(_id);
		if (!alertTypeExists.success) {
			return res.status(404).json(alertTypeExists.content);
		}

		res.status(200).json(alertTypeExists.content);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
module.exports = controller;
const RolService = require('../../services/Rol');

const controller = {};

controller.create = async (req, res) => {
	const fieldsValidation = RolService.verifyCreateFields(req.body);
	if (!fieldsValidation.success) {
		return res.status(400).json(fieldsValidation.content);
	}

	try {
		const createRol = await RolService.create(req.body);
		if (!createRol.success) {
			return res.status(409).json(createRol.content);
		}

		res.status(201).json(createRol.content);
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
		const rolResponse = await RolService.findAll(parseInt(page), parseInt(limit));
		res.status(200).json(rolResponse.content);
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
		const rolExists = await RolService.findOneByID(_id);
		if (!rolExists.success) {
			return res.status(404).json(rolExists.content);
		}

		const deleted = await RolService.deleteOneByID(_id);
		if (!deleted.success) {
			return res.status(500).json(deleted.content);
		}

		res.status(200).json(deleted.content);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

controller.updateByID = async (req, res) => {
    const {rol} = req;
	const verifyField = RolService.verifyUpdateFields(req.body);
	if (!verifyField.success) {
		return res.status(400).json(verifyField.content);
	}

	if (!rol) {
		return res.status(404).json({
			error: 'Rol not found'
		});
	}

	try {
		const rolUpdated = await RolService.updateByID(rol, verifyField.content);
		if (!rolUpdated.success) {
			return res.status(409).json(rolUpdated.content);
		}

		return res.status(200).json(rolUpdated.content);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};
module.exports = controller;
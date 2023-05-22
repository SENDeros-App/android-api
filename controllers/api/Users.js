const UserService = require('../../services/User');
const controller = {};
const { verifyID } = require('../../utils/MongoUtils');
const AlertService = require('../../services/Alert');

//getuser
controller.getUser = (req, res) => {
	const { user } = req;
	if (!user) {
		return res.status(404).json({
			error: 'User not found'
		});
	}

	return res.status(200).json({ ...user._doc, validTokens: undefined });
};

controller.updateByID = async (req, res) => {
	const { user } = req;
	const verifyField = UserService.verifyUpdateFields(req.body);
	if (!verifyField.success) {
		return res.status(400).json(verifyField.content);
	}

	if (!user) {
		return res.status(404).json({
			error: 'User not found'
		});
	}

	try {
		const userUpdated = await UserService.updateByID(user, verifyField.content);
		if (!userUpdated.success) {
			return res.status(409).json(userUpdated.content);
		}

		return res.status(200).json(userUpdated.content);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.getProfile = async (req, res) => {
	const { _id } = req.params;

	if (!verifyID(_id)) {
		return res.status(400).json({
			error: 'Error in ID'
		});
	}

	try {
		const userExists = await UserService.findOneByID(_id);
		if (!userExists.success) {
			return res.status(404).json(userExists.content);
		}

		const user = userExists.content;
		const alert = await AlertService.findAllByUserID(user._id);

		return res.status(200).json({
			...user._doc,
			alerts: alert.content,
			savedPosts: undefined,
			validTokens: undefined
		});
	} catch (error) {
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}
};

controller.getTopN = async (req, res) => {
	if(!req.params.n){
		res.status(400).json({
			message: 'Debe incluir el valor del top n en la ruta'
		});
	}
	try {
		const { n } = req.params;

		const users = await UserService.getTopNUsersWithMostAlerts( n );
		res.status(200).json(users);
	  } catch (error) {
		// Maneja el error
		console.log(error)
		return res.status(500).send({
			error: 'Internal Server Error (Controller)'
		});
	  }
}

controller.getRankByUserId = async (req, res) => {
	const { user } = req;
	if (!user) {
		return res.status(404).json({
			error: 'User not found'
		});
	}

	try{
		const userRank = await UserService.getUserRankByUserId(user._id);

		return res.status(200).json( userRank );
	}catch(error){
		return res.status(500).json({
			error: 'Internal Server Error'
		});
	}

}

module.exports = controller;
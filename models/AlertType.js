const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlertTypeSchema = new Schema(
	{
		
		name: {
			type: String,
			required: true
		},
		description: String,
	}
);

module.exports = mongoose.model('AlertType', AlertTypeSchema);
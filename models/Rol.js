const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolSchema = new Schema(
	{
		
		name: {
			type: String,
			required: true
		},
		description: String,
	}
);

module.exports = mongoose.model('Rol', RolSchema);
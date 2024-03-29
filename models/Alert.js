const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlertSchema = new Schema(
	{
		
		latitud: {
			type: Number,
			required: true
		},
		longitud: {
			type: Number,
			required: true
		},
		type: {
			type: String,
			ref: 'AlertType',
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		name:{
			type: String,
			required: true 
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Alert', AlertSchema);
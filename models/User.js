const Crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		hashedPassword: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			required: true
		},
		rank: {
			type: String,
			required: true,
			default: 'Noob'
		},
		phoneNumber: {
			type: String,
			required: true,
			unique: true
		},
		validTokens: [ String ],
		savedAlerts: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Alert'
				}
			]
		},
	},
	{
		timestamps: true
	}
);

UserSchema.virtual('password').set(function(password) {
	this.hashedPassword = Crypto.createHmac('sha256', password).digest('hex');
});

UserSchema.methods = {
	comparePassword: function(password) {
		return Crypto.createHmac('sha256', password).digest('hex') === this.hashedPassword;
	},
	updatePassword: async function(newPassword) {
        this.hashedPassword = Crypto.createHmac('sha256', newPassword).digest('hex');
		//return this.save();
        return await this.save();
    }
};

module.exports = mongoose.model('User', UserSchema);
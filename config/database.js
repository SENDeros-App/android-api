const Mongoose = require('mongoose');
/*
const dbhost = process.env.DBHOST || 'localhost';
const dbport = process.env.DBPORT || '27017';
const dbname = process.env.DBNAME || 'ProyectoPDM';
*/
const uri = process.env.DBURI //|| `mongodb://${dbhost}:${dbport}/${dbname}`;

const connect = async () => {
	try {
		await Mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
				});
		console.log('DB connected');
	} catch (error) {
		console.log('Error in connection');
		console.log(error);
		process.exit(1);
	}
};

module.exports = {
	connect
};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
	code:String
});

const Admin =  mongoose.model('admincode',AdminSchema);
module.exports = Admin;


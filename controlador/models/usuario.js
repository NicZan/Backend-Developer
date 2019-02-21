//atributos da coleção de usuários: name, age, phone, is_admin (diferencia um usuário comum de super usuários).

var  mongoose = require('mongoose');
var crypto = require('crypto');

var schemaUsuario = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	userage: {
		type: Number,
		required: true
	},
	userphone: {
		type: Number,
		required: true
	},
	isadmin: {
		type: Boolean,
		required: true
	},
	token: {
		type: String
	}

},{
	timestamp: true
});

schemaUsuario.pre('save', function(next){
	if(!this.token){
		this.token = crypto.randomBytes(64).toString('hex');
		next(null);
	}
	next(null);
});

module.exports = mongoose.model('Usuario', schemaUsuario);
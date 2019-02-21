var routes = require('express').Router();
var Usuario = require('../models/usuario');

//Rota post, adiciona um novo usuario

routes.post('/', function(requisicao, resposta){
	if(!requisicao.body.username || !requisicao.body.userage || 
	   !requisicao.body.userphone ){
			return resposta.status(422).send({error: "Campos incompletos."});
	}
	if(requisicao.body.userage < 18 || isNaN(requisicao.body.userage)){
		return resposta.status(422).send({error: "idade menor de 18 ou nao é um numero."});
	}
	if(requisicao.body.userphone.toString().length > 12 || requisicao.body.userphone.toString().length < 8 
		|| isNaN(requisicao.body.userphone)){
		return resposta.status(422).send({error: "quantidade de digitos do userphone esta invalida."});
	}
	var novoUsuario = new Usuario({
		username: requisicao.body.username,
		userage: parseInt(requisicao.body.userage),
		userphone: parseInt(requisicao.body.userphone),
		isadmin: requisicao.body.isadmin
	});
	novoUsuario.save(function(err){
		if(err)return resposta.status(403).send({error: err});
		return resposta.send({usuario: novoUsuario});
	});
}); 

//get pegar um usuario pelo id

routes.get('/id/:identificacao', function(requisicao, resposta){
	if(!requisicao.params.identificacao){
		return resposta.status(422).send({error: "Campos incompletos."});
	}
	Usuario.findById(requisicao.params.identificacao).select('_id username userage userphone isadmin').exec(function(err, usuario){
		if(err) return resposta.status(403).send({error: err});
		if(!usuario) return resposta.status(403).send({error: "usuario não existe para este id"});
		return resposta.send({usuario});
	});
});


//get pega um usuario pelo token

routes.get('/token/:token', function(requisicao, resposta){
	if(!requisicao.params.token){
		return resposta.status(422).send({error: "Campos incompletos."});
	}
	Usuario.findOne({
		token: requisicao.params.token
	}).select('_id username userage userphone isadmin').exec(function(err, usuario){
		if(err) return resposta.status(403).send({error: err});
		if(!usuario) return resposta.status(403).send({error: "usuario não existe para este token"});
		return resposta.send({usuario});
	});
});



//put atualizar um campo do usuario pelo token

routes.put('/', function(requisicao, resposta){
	if(!requisicao.body.token || !requisicao.body.username || !requisicao.body.userage || 
	   !requisicao.body.userphone ){
		return resposta.status(422).send({error: "Faltam o token."});
	}
	Usuario.findOne({
		token: requisicao.body.token
	}).exec(function(err, usuario){
		if(err) return resposta.status(403).send({error: err});
		if(!usuario) return resposta.status(403).send({error: "usuario não existe para este token"});
		if(requisicao.body.username != usuario.username){
			usuario.username = requisicao.body.username;
		}
		if(parseInt(requisicao.body.userphone) != usuario.userphone){
			usuario.userphone = parseInt(requisicao.body.userphone);
		}
		if(parseInt(requisicao.body.userage) != usuario.userage){
			usuario.userage = parseInt(requisicao.body.userage);
		}
		if(!validadados(usuario)){
			return resposta.status(403).send({error: "dados novos inconsistentes"});
		}
		usuario.save(function(err){
			if(err) return resposta.status(403).send({error: err});
			return resposta.send({usuario});
		});
	});
});

//deleta um usuario atravez do identificador, se o campo isadmin for = true ela nao pode ser apagado

routes.put('/delete/:identificacao', function(requisicao, resposta){
	if(!requisicao.params.identificacao){
		return resposta.status(422).send({error: "O id nao foi passado como parametro"});
	}
	Usuario.findById(requisicao.params.identificacao).select('isadmin').exec(function(err, isadmin){
		if(err) return resposta.status(403).send({error: err});
		if(!isadmin) return resposta.status(403).send({error: "campo admin vazio"});
		if(isadmin.isadmin == true ) return resposta.status(403).send({error: "o usuario é adm e nao pode ser apagado"});
		Usuario.findByIdAndRemove(requisicao.params.identificacao).exec(function(err){
			if(err) return resposta.status(403).send({error: err});
			resposta.send({resultado: "remocao concluida"});
		});
	});

});



function validadados(usuario){
	if(usuario.userage < 18 || isNaN(usuario.userage)){
		return false;
	}
	if(usuario.userphone.toString().length > 12 || usuario.userphone.toString().length < 8 
		|| isNaN(usuario.userphone)){
		return false;
	}
	return true;
}


module.exports = routes;
var chai = require('chai');
var server = require('../index');
var chaiHttp = require('chai-http');
var Usuario = require('../models/usuario');
var should = chai.should();

chai.use(chaiHttp);

describe('Usuario', function(){

var id,id1;

var token,token1;

/*

 //remove todos os usuario do banco
	before(function(next){
		Usuario.remove({}, function(err){
			next();
		});
	});
*/

// teste da inserção de um novo usuário passando os dados corretos

it('Novo Usuario', function(done){

	var novoUsuario = {
		username: "nicolas",
		userage: 26,
		userphone: 996181648,
		isadmin: true
	};

	chai.request(server)
		.post('/usuario')
		.send(novoUsuario)
		.end(function(err, resposta){	
			resposta.should.have.status(200);
			resposta.body.should.have.property('usuario');

			resposta.body.usuario.should.have.property('_id');
			resposta.body.usuario.should.have.property('token');
			resposta.body.usuario.should.have.property('username');
			resposta.body.usuario.should.have.property('userage');
			resposta.body.usuario.should.have.property('userphone');
			resposta.body.usuario.should.have.property('isadmin');


			resposta.body.usuario.username.should.be.equal('nicolas');
			resposta.body.usuario.userage.should.be.equal(26);
			resposta.body.usuario.userphone.should.be.equal(996181648);
			resposta.body.usuario.isadmin.should.be.equal(true);

			token = resposta.body.usuario.token;
			id = resposta.body.usuario._id;

			done();
		});	


});


it('Novo Usuario Nao Adm', function(done){

	var novoUsuario1 = {
		username: "nicolas",
		userage: 26,
		userphone: 996181648,
		isadmin: false
	};

	chai.request(server)
		.post('/usuario')
		.send(novoUsuario1)
		.end(function(err, resposta){	
			resposta.should.have.status(200);
			resposta.body.should.have.property('usuario');

			resposta.body.usuario.should.have.property('_id');
			resposta.body.usuario.should.have.property('token');
			resposta.body.usuario.should.have.property('username');
			resposta.body.usuario.should.have.property('userage');
			resposta.body.usuario.should.have.property('userphone');
			resposta.body.usuario.should.have.property('isadmin');


			resposta.body.usuario.username.should.be.equal('nicolas');
			resposta.body.usuario.userage.should.be.equal(26);
			resposta.body.usuario.userphone.should.be.equal(996181648);
			resposta.body.usuario.isadmin.should.be.equal(false);

			token1 = resposta.body.usuario.token;
			id1 = resposta.body.usuario._id;

			done();
		});	


});


//teste de inserção de um novo usuário passando a idade menor que 18 anos

it('Novo Usuario idade incorreta', function(done){

	var novoUsuario = {
		username: "nicolas",
		userage: 17,
		userphone: 996181648,
		isadmin: true
	};

	chai.request(server)
		.post('/usuario')
		.send(novoUsuario)
		.end(function(err, resposta){	
			resposta.should.have.status(422);
			console.log(resposta.body);
			done();
		});	


});

//teste de inserção de um novo usuário com telefone < 8 numeros

it('Novo Usuario telefone incorreto', function(done){

	var novoUsuario = {
		username: "nicolas",
		userage: 26,
		userphone: 9961816,
		isadmin: true
	};

	chai.request(server)
		.post('/usuario')
		.send(novoUsuario)
		.end(function(err, resposta){	
			resposta.should.have.status(422);
			console.log(resposta.body);
			done();
		});	


});



it('Pegar usuario pelo Id', function(done){

	chai.request(server)
		.get('/usuario/id/'+id)
		.end(function(err, resposta){	

			resposta.should.have.status(200);
			resposta.body.should.have.property('usuario');

			resposta.body.usuario.should.have.property('_id');
			resposta.body.usuario.should.have.property('username');
			resposta.body.usuario.should.have.property('userage');
			resposta.body.usuario.should.have.property('userphone');
			resposta.body.usuario.should.have.property('isadmin');


			resposta.body.usuario.username.should.be.equal('nicolas');
			resposta.body.usuario.userage.should.be.equal(26);
			resposta.body.usuario.userphone.should.be.equal(996181648);
			resposta.body.usuario.isadmin.should.be.equal(true);

	done();
	});
});


it('Pegar usuario pelo token', function(done){
	chai.request(server)
		.get('/usuario/token/'+token)
		.end(function(err, resposta){	

			resposta.should.have.status(200);
			resposta.body.should.have.property('usuario');

			resposta.body.usuario.should.have.property('_id');
			resposta.body.usuario.should.have.property('username');
			resposta.body.usuario.should.have.property('userage');
			resposta.body.usuario.should.have.property('userphone');
			resposta.body.usuario.should.have.property('isadmin');


			resposta.body.usuario.username.should.be.equal('nicolas');
			resposta.body.usuario.userage.should.be.equal(26);
			resposta.body.usuario.userphone.should.be.equal(996181648);
			resposta.body.usuario.isadmin.should.be.equal(true);

	done();
	});
});


it('Alterar usuario dados valido', function(done){

	var usuarioAlterado = {
		token: token,
		username: "nicolas alvarenga",
		userage: 27,
		userphone: 996181648,
		isadmin: true
	};

	chai.request(server)
	.put('/usuario')
	.send(usuarioAlterado)
	.end(function(err, resposta){

		resposta.should.have.status(200);
		resposta.body.should.have.property('usuario');

		resposta.body.usuario.should.have.property('_id');
		resposta.body.usuario.should.have.property('token');
		resposta.body.usuario.should.have.property('username');
		resposta.body.usuario.should.have.property('userage');
		resposta.body.usuario.should.have.property('userphone');
		resposta.body.usuario.should.have.property('isadmin');

		
		resposta.body.usuario.username.should.be.equal('nicolas alvarenga');
		resposta.body.usuario.userage.should.be.equal(27);
		resposta.body.usuario.userphone.should.be.equal(996181648);
		resposta.body.usuario.isadmin.should.be.equal(true);


		done();
	});

	
});


it('Alterar usuario  dados invalidos', function(done){
	var usuarioAlterado = {
			token: token,
			username: "nicolas alvarenga",
			userage: 17,
			userphone: 996181648,
			isadmin: true
		};

		chai.request(server)
		.put('/usuario')
		.send(usuarioAlterado)
		.end(function(err, resposta){

			resposta.should.have.status(403);
			console.log(resposta.body);

			done();
		});
	
});



//remove usuario pelo id usuario adm nao sera apagado
it('remover usuario adm', function(done){


     	chai.request(server)
		.put('/usuario/delete/'+id)
		.end(function(err, resposta){
			resposta.should.have.status(403);
			console.log(resposta.body);
			done();
		});
	
});

//remove um usuario pelo id

it('remover usuario n adm', function(done){


     	chai.request(server)
		.put('/usuario/delete/'+id1)
		.end(function(err, resposta){
			resposta.should.have.status(200);
			console.log(resposta.body);
			done();
		});
	
}); 


});

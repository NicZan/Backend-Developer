var express = require('express');
var bodyParser = require('body-parser');
var morgan = require("morgan");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/controlador');
var app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var Usuario = require('./models/usuario');
var UsuarioRoutes = require('./routes/usuario');


app.use('/usuario', UsuarioRoutes);



app.get('/', function(requisicao, resposta, proximo){
	resposta.send('ok');
});


app.listen(28000, function(){
	console.log('rodando');
});


module.exports = app;
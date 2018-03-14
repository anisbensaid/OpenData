'use strict';

var fs = require('fs');
var path = require('path');
var PATH_UPLOAD = path.normalize(__dirname+'/file-upload/');
var formidable = require('formidable');
var logger;
var core = require('./core');
var file_pattern = /[0-9a-z]+\.+csv$/i;


function sayHello(req, res) {
  logger.info('My module controller says hello world!');
  console.log(analysis);
  return res.json(200, {message: "analysis.demo()"});
}
function upload(req, res) {
  // receive form data
  var form = new formidable.IncomingForm();
  
	form.parse(req, function (err, fields, files) {
    // check file
    if(!file_pattern.test(files.file.name)){
      res.json(200,{status : 0 , error : "Sorry , we only accept .csv files !!!!"});
      return;
    }
  	var content = fs.readFileSync(files.file.path).toString();
    var columns = fields.columns.split(',');
    logger.info(columns);



  	fs.writeFileSync(PATH_UPLOAD+files.file.name, content);
  	content = fs.readFileSync(PATH_UPLOAD+files.file.name).toString();
  	//res.json(200,{status : 1 , data : core.detectData(content)});
    var parsed = core.detectData(content);
    var filtered = parsed.filter(function(column){
      return columns.includes(column.title);
    });
    res.json(200,{status : 1 , data : filtered });
});


}

//Connexion to MangoDB
// Inclusion de Mongoose
var mongoose = require('mongoose');
 

// On se connecte à la base de données

mongoose.connect('mongodb://localhost/blog', function(err) {
  if (err) { throw err; }
});

// Création du schéma 
var graphIdSchema = new mongoose.Schema({
  hash : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  columns : String
});
 
// Création du Model 

var graphIdModel = mongoose.model('hash', graphIdSchema);
  
// On crée une instance du Model

var newHash = new graphIdModel({ hash : 'anisou' });
newHash.columns = 'bensaid';
 
// On le sauvegarde dans MongoDB !
newHash.save(function (err) {
  if (err) { throw err; }
  console.log('hash ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});



module.exports = function(dependencies) {
  logger = dependencies('logger');
  core = require('./core')(dependencies);
  return {
    sayHello: sayHello,
    upload : upload
  };
};

var express = require('express');
var app = express();
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

app.set('port', (process.env.PORT || 5000));

app.get('/home', function (req,res){
	fs.readFile('form.html', function (err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/html',
					'Content-Length': data.length
			});
			res.write(data);
			res.end();
		});
});

app.get('/', function (req,res){
	fs.readFile('form.html', function (err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/html',
					'Content-Length': data.length
			});
			res.write("Welcome to Shagufta's page");
			res.end();
		});
});

app.post('/home', function (req,res){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
		
	  db.collection("customers").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		res.send(result)
		db.close();
	  });	
	});
});

/*

var server = app.listen(8085, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});
*/


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

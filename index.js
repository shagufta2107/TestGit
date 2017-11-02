var express = require('express');
var app = express();
var fs = require("fs");
MongoClient = require('mongodb').MongoClient;

MONGO_URL = 'mongodb://testUser1:tester123@ds245615.mlab.com:45615/shagufta_database';
/*
MongoClient.connect(MONGO_URL, (err, db) => {  
  if (err) {
    return console.log(err);
  }

  
  db.collection('ProductCollection').insertOne(
    {
      title: 'Hello MongoDB',
      text: 'Hopefully this works!'
    },
    function (err, res) {
      if (err) {
        db.close();
        return console.log(err);
      }
	  
	  db.collection("ProductCollection").find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
     
      db.close();
    }
  )
}); */

app.set('port', (process.env.PORT || 5000));
app.get('/sa', function(request, response) {
	fs.readFile('form.html', function (err, data) {
				response.writeHead(200, {
					'Content-Type': 'text/html'
						
				});
				response.write(data);
				response.end();
			});
	});


app.get('/home', function (req,res){
	MongoClient.connect(MONGO_URL, function(err, db) {
	  if (err) throw err;
		
	  db.collection("ProductCollection").find({}).toArray(function(err, result) {
		if (err) throw err;
		//console.log(result);
		res.send(result)
		db.close();
	  });	
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

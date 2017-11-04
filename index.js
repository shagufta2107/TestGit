var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var fs = require("fs");


MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

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

app.get('/test', function(request, response) {
	fs.readFile('form.html', function (err, data) {
				response.writeHead(200, {
					'Content-Type': 'text/html',
						
				});
				response.write("test");
				response.end();
			});
	});
app.get('/create', function(request, response) {
	fs.readFile('form.html', function (err, data) {
				response.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': data.length	
				});
				response.write(data);
				response.end();
			});
	});

app.post('/create',function(req,res)
{
	console.log(req.body);
	//console.log(req.body.category);
	//console.log(req.body.mainCategory);
	
	MongoClient.connect(MONGO_URL, function(err, db)
	{
		if (err) throw err;
			
		 db.collection('ProductCollection').insertOne(
		{
		    ProductId: (req.body.productId),
			Category: (req.body.category),
			MainCategory:(req.body.mainCategory)
		},
		function (err, res)
		{
			if (err)
			{
				db.close();
				return console.log(err);
			}
		});
	  
	});
	res.send(req.body);
	
});
	
app.get('/products', function (req,res){
	
	
	if (!req.query.prodId)
	{
		
		MongoClient.connect(MONGO_URL, function(err, db) {
		  if (err) throw err;
			
		  db.collection("ProductCollection").find({}).toArray(function(err, result) {
			if (err) throw err;
			//console.log(result);
			res.send(result)
			db.close(); 
		  });	
		});
	}
	
	else
	{
		console.log(req.query.prodId);
		var prodId = req.query.prodId;
		
		//res.send(prodId)
		MongoClient.connect(MONGO_URL, function(err, db) {
		  if (err) throw err;
			
		  db.collection("ProductCollection").find({ProductId: prodId}).toArray(function(err, result) {
			if (err) throw err;
			//console.log(result);
			res.send(result)
			db.close(); 
		  });	
		});
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

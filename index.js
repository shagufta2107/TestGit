var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var fs = require("fs");
var path=require("path");
var async=require('async');
var await = require('await');


MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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

app.get('/home', function(request, response) {
	fs.readFile('index.html', function (err, data) {
				response.writeHead(200, {
					'Content-Type': 'text/html',
						
				});
				response.write(data);
				response.end();
			});
	});
	
app.get('/test', function(request, response) {
	response.send("req received");

});
/*app.get('/create', function(request, response) {
	fs.readFile(__dirname + 'form.html', function (err, data) {
				response.writeHead(200, {
					'Content-Type': 'text/html',
					
				});
				response.render(data);
				//response.end();
			});
	});*/

app.get('/create', function(req, res) { 
	console.log("request recievedfor create get")
    res.sendFile(path.join(__dirname, 'form.html'));
});
app.get('/form', function(req, res) { 
console.log(path.join(__dirname,'form.html'))
    res.sendFile(path.join(__dirname, 'form.html'));
});


function callback(prodCount)
{
	console.log("callback--->"+prodCount);
 /*	if (prodCount)
	{
		
		insResponse = { error: false, message: "Product already exists" };
		res.send(insResponse);
	}
	else
	{
		MongoClient.connect(MONGO_URL, function(err, db)
		{
				
			db.collection('ProductCollection').insertOne(
			{
				_id: (req.body.productId),
				Category: (req.body.category),
				MainCategory:(req.body.mainCategory),
				Price:req.body.price
			},function (err, result)
				{
					if (err) 
					{
						
						insResponse = { error: true, message: "Error adding the product." };
						
					}	
				
				console.log(result);
				insResponse = { error: false, message: "successfully added.",id: result.insertedId  };
				res.send(insResponse);
				db.close();
				});
						
				
		});
	}
	*/
}

app.post('/create',function(req,res)
{
	console.log("request recieved for create post");
	console.log(req.body);
	prodId=req.body.productId;

	MongoClient.connect(MONGO_URL, function(err, db)
	{
		prodCount = (db.collection("ProductCollection").findOne({_id: prodId}));
			db.close();
		callback(prodCount);
	}); 
	
});


app.delete('/delete',function(req,res)
{
	console.log(req.body);
	if (!req.query.prodId)
	{
		
		console.log("No Product chosen to be deleted");
	}
	
	else
	{
		console.log(req.query.prodId);
		var prodId = req.query.prodId;
		
		//res.send(prodId)
		MongoClient.connect(MONGO_URL, function(err, db) {
		  if (err) throw err;
			/*db.collection("ProductCollection").remove({_id: prodId},function (err, task) {  

			var response = {
				message: "task successfully deleted",
				id: req.mongo_id
				};
				res.send(response);
				);
			 if (err) throw err;*/
		  db.collection("ProductCollection").remove({_id: prodId},function(err, result) {
			if (err) throw err;
			var result1 = {
				message: "Product successfully deleted",
				id: prodId
			};
			console.log(result1);
			console.log(result);
			res.send(result1)
			db.close(); 
		  });
		  
		//  db.close();
		});
	}
	
});
	
app.get('/products', function (req,res){
	
	
	if (!req.query.prodId)
	{
		
		MongoClient.connect(MONGO_URL, function(err, db) {
		  if (err) throw err;
			
		  db.collection("ProductCollection").find().sort({"Price":1}).toArray(function(err, result) {
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
			
		  db.collection("ProductCollection").find({_id: prodId}).toArray(function(err, result) {
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

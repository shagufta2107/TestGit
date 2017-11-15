var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var fs = require("fs");
var path=require("path");
var async=require('async');
var await = require('await');
var callback= require('callback');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var session = require('client-sessions');

spath = path.join(__dirname, 'public');
console.log(spath);
app.use(express.static(spath));

MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(session({
	cookieName: 'session',
	secret: 'random_string_goes_here',
	duration: 1 * 60 * 1000,
	activeDuration: 1 * 60 * 1000,
  }));

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
mongoose.connect(MONGO_URL,{ useMongoClient: true });
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
	if(request.session.user)
	{	
			console.log(" session");
			console.log("user -->"+request.session.user.username);
				fs.readFile('index.html', function (err, data) {
					response.writeHead(200, {
						'Content-Type': 'text/html',

					});
					response.write(data);
					response.end();
				});


			}
			else{
				console.log("no session");
				fs.readFile('unloggedin.html', function (err, data) {
					response.writeHead(200, {
						'Content-Type': 'text/html',

					});
					response.write(data);
					response.end();
				});

			}
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



var checkIfExists = function(db,prodId,callback)
{

			db.collection("ProductCollection").find({_id: prodId}).toArray(function(err, result) {

			db.close;
			if(err)
			{
				console.log(err);
			}
			else{

			callback(null,result);// on commenting this, no error
			}



		});

}

app.post('/create',function(req,res)
{
	console.log("request recieved for create post");
	//console.log(req.body);
	prodId=req.body.productId;

	if (req.session.user)	{

			MongoClient.connect(MONGO_URL, function(err, db)
			{ if (err) throw err;
				checkIfExists(db,prodId,function (err, doc) {
				if(err)
					{
					// error here
					console.log("Error1");
					console.log(err);
					return;
				}

				if(doc.length) {
					insResponse = { error: true, message: "Product already exists." };
					res.send(insResponse);
					//console.dir(doc);
				}
				else
				{
					console.log('insert');


					db.collection('ProductCollection').insertOne(
					{
						_id: (req.body.productId),
						Category: (req.body.category),
						MainCategory:(req.body.mainCategory),
						Price:req.body.price,
						AddedBy: req.session.user.username
						
					},function (err, result)
						{
							if (err)
							{

								insResponse = { error: true, message: "Error adding the product." };
								res.send(insResponse);

							}

						//console.log(result);
						insResponse = { error: false, message: "successfully added.",id: result.insertedId  };
						res.send(insResponse);
						db.close();
						});



				}

			});

		});
	}
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


// ------ Update function ------------
app.get('/update', function(req, res) {
	console.log("request recievedfor update get")
    res.sendFile(path.join(__dirname, 'updateProduct.html'));
});

app.post('/update',function(req,res)
{
	console.log("request recieved for update post");
	console.log(req.body);
	prodId=req.body.prodId;
	console.log(prodId);
	console.log(req.session.user.username);

	if (req.session.user)
	{

		MongoClient.connect(MONGO_URL, function(err, db)
		{

				db.collection('ProductCollection').update( {_id: prodId},
				{	$set:
					{

						Category: (req.body.category),
						MainCategory:(req.body.mainCategory),
						Price:req.body.price,
						LastUpdatedBy:req.session.user.username
					}
				},function (err, result)
					{
						if (err)
						{

							insResponse = { error: true, message: "Error updating the product." };
							res.send(insResponse);

						}
					console.log("success");
					//console.log(result);
					insResponse = { error: false, message: "Successfully updated product."+req.body.prodId};
					res.send(insResponse);
					db.close();
					});
		});
	
	}

});

// ----------------- Start: Register new user-------------------------------------


// ---------------- creating Users collection using mongoose (11/7/2017)--------------------------------
// one time
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//db.once('openUri', function() {
	 var UserSchema = new mongoose.Schema({
	  email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	  },
	  username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	  },
	  password: {
		type: String,
		required: true,
	  }
	 
	  
	 }) ;


	 UserSchema.plugin(uniqueValidator);
	 var user = mongoose.model('user', UserSchema);
//module.exports = User;

//});

/*
app.get('/register', function(req, res) {
	console.log("request recieved for register get")
    res.sendFile(path.join(__dirname, 'regUser.html'));
});*/

app.post('/register', function(req, res) {
	console.log("request recieved for register post");
	console.log(req.body);
	bcrypt.hash(req.body.password, 10, function(err, hash) {
		if (err) throw err;
		var userData = {
			username:req.body.name,
			email:req.body.email,
			password: hash
		};
		
		var user1 = new user(userData);
		user1.save( function(error, data){
			if(error){
				console.log(error);
				insResponse = { error: true, message: "Oooops! Something went wrong."  };
				res.send(insResponse);
			}
			else{
				insResponse = { error: false, message: "User Registered successfully"  };
				res.send(insResponse);
			}
		});

		
	});
	
	
});

// ----------------- Finish: Register new user-------------------------------------

//------------Start: User session ------------------
;
	
//------------End: User session -------------------

// ----------------- Start: Login user-------------------------------------
app.post('/login', function(req, res) {
	console.log("Reqr received for 'login' post");
	console.log(req.body);

	
	//var user = new userModel();
	user.findOne({ 'username': req.body.loginUsername, email:req.body.loginEmail}, function (err, authenticatedUser) {
		if (err) return handleError(err);

		if(authenticatedUser){
			console.log(authenticatedUser.username);
			console.log(req.body.loginPassword);
			console.log(authenticatedUser.password);
			if(bcrypt.compareSync(req.body.loginPassword, authenticatedUser.password)) {
				console.log("Authentication successful");
				// sets a cookie with the user's info
				req.session.user = authenticatedUser;
				insResponse = { error: false, message: "Authentication successful. Welcome "  };
				
				res.send(insResponse);
				return;
			   } 
			   else {
				console.log("Authentication failed");
				insResponse = { error: true, message: "Incorrect login credentials, authentication failed."  };
				res.send(insResponse);
				return;
			   }
		}

		else{
			console.log("User Does not exist. Both Username and Email are required. ");
			insResponse = { error: true, message: "User Does not exist. Both Username and Email are required."  };
			res.send(insResponse);;
			return;
		}

	  	});

	
	
});

// ----------------- Finish: Login user-------------------------------------

//-------------------Start: Logout User-----------------
app.post('/logout', function(request, response) {
	console.log("Logout request");


	request.session.reset();
    response.redirect('/home');
 /*  fs.readFile('unloggedin.html', function (err, data) {
	response.writeHead(200, {
		'Content-Type': 'text/html',

	});
	response.write(data);
	response.end();
});*/

});

//-----------------End: Logout User---------------------------

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

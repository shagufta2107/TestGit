var express = require('express');
var app = express();
var fs = require("fs");


app.set('port', (process.env.PORT || 5000));

app.get('', function (req,res){
			res.end("fjgdfhd");
			//return res.send("Welcome to Shagufta's page");
		});
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

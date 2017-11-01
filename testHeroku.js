var express = require('express');
var app = express();
var fs = require("fs");


app.set('port', (process.env.PORT || 5000));

app.get('/home', function (req,res){
	fs.readFile('form.html', function (err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/html',
					'Content-Length': data.length
			});
			//res.write("Welcome to Shagufta's page");
			//res.end();
			res.send("Welcome to Shagufta's page");
		});
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

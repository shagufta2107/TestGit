var express = require('express');
var app = express();
var fs = require("fs");


app.set('port', (process.env.PORT || 5000));
app.get('/', function(request, response) {
response.writeHead(200, {
				'Content-Type': 'text/html'
			});
response.end("al");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

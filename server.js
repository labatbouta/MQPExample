/**
 * Created by lisabatbouta on 2/11/15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var routes = require('./routes/routes')(app);

var port = process.env.PORT || 4034;

app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log("listening on port: " + port);
});
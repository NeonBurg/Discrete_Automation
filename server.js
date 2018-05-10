const express = require('express');
const app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended' : 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride('X-HTTP-Method-Override'));

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

require('./app/routes.js')(app);
require('./app/serverAPI.js')(app);

app.listen(3000, "192.168.0.100", function() {
    console.log('Example app listening on port 3000 !');
});
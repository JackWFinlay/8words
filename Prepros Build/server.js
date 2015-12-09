// server.js

// modules =================================================
// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var path       = require('path');

var bodyParser = require('body-parser');
var User       = require('./app/models/user'); // get our mongoose model
var morgan     = require('morgan');
var authenticate = require('./app/routes/authenticate');
var sentences = require('./app/routes/sentences');
var registerRoute  = require('./app/routes/register-route');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// serve static resources. i.e. public/css/site.css will be css/site.css
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '../')));

app.use(morgan('dev'));

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', authenticate);
app.use('/api', sentences);
app.use('/api', registerRoute);

app.get('/', function(req, res) {
        res.sendFile("/public/index.html", {"root": __dirname});
});

app.get('/register', function(req, res) {
        res.sendFile("/public/register.html", {"root": __dirname});
});

app.get('/login', function(req, res) {
        res.sendFile("/public/login.html", {"root": __dirname});
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);                       

// server.js

// modules =================================================
// BASE SETUP
// =============================================================================

// call the packages we need
var express    	   = require('express');        // call express
var app        	   = express();                 // define our app using express
var path       	   = require('path');
var session    	   = require('express-session');
var MongoDBStore   = require('connect-mongodb-session')(session);
var bodyParser 	   = require('body-parser');
var User       	   = require('./app/models/user'); // get our mongoose model
var morgan     	   = require('morgan');
var authenticate   = require('./app/routes/authenticate');
var sentences      = require('./app/routes/sentences');
var registerRoute  = require('./app/routes/register-route');
var db 		       = require('./config/db');
var secret         = require('./config/secret');
var jwt            = require('jsonwebtoken');
var cookieParser   = require('cookie-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(cookieParser());

// serve static resources. i.e. public/css/site.css will be css/site.css
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '../')));

app.use(morgan('dev'));

// SESSION STORE
// =============================================================================

// var store = new MongoDBStore(
// 	{ 
// 	uri: db.url,
// 	collection: 'sessions'
// 	});

// store.on('error', function(error) {
//       assert.ifError(error);
//       assert.ok(false);
//     });

// app.use(session({
// 		secret: secret.secret,
// 		cookie: {
// 			maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
// 		},
// 		store: store,
// 		resave: false,
//     	saveUninitialized: false
//     }));


// ROUTE
// =============================================================================
var router = express.Router();// get an instance of the express Router

app.use(function(req, res, next){
	//console.log(req.session.username);
	if (req.cookies.username === undefined ){
		var token = req.cookies.token;
		jwt.verify(token, secret.secret, function(err, decoded) {      
		    if (err) {
	      	   	console.log('token verification error');
		    } else {
	      		req.decoded = decoded; 
				res.cookie('username' , req.decoded.username, {secure: false, httpOnly: false});		      	next();
		    	next();
		    }
	    });
	}
	next();
});

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
		if (req.cookies.token !== undefined) {
			//Send the user back to the homepage if already logged in.
			res.redirect("/"	); 
		} else {
        	res.sendFile("/public/login.html", {"root": __dirname});
    	}
});

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080;        // set our port
app.listen(port);
console.log('Magic happens on port ' + port);                       

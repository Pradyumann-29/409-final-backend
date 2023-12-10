// // Get the packages we need
// var express = require('express'),
//     router = express.Router({ mergeParams: true }), //otherwise id will not be passed
//     mongoose = require('mongoose'),
//     secrets = require('./config/secrets'),
//     bodyParser = require('body-parser');

// // Create our Express application
// var app = express();

// // Use environment defined port or 4000
// var port = process.env.PORT || 4000;

// // Connect to a MongoDB --> Uncomment this once you have a connection string!!
// mongoose.connect(secrets.mongo_connection,  { useNewUrlParser: true });
// console.log("Connected to Mongo:" + secrets.mongo_connection);

// // Allow CORS so that backend and frontend could be put on different servers
// var allowCrossDomain = function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     next();
// };
// app.use(allowCrossDomain);

// // Use the body-parser package in our application
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());

// // Use routes as a module (see index.js)
// const routes = require ('../routes/routes');

// app.get("/", (req, res) => {
//     res.send("Express on Vercel");
//   });
  
// app.use('/', routes);

// // Start the server
// app.listen(port);
// console.log('Server running on port ' + port);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require ('../routes/routes');

var app = express();

const whitelist = [
  '*'
];

app.use((req, res, next) => {
  const origin = req.get('referer');
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

app.use('/', indexRouter);

module.exports = app;
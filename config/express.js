var express = require('express');
var session = require('express-session');
var glob = require('glob');
var crypto = require('crypto');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var passport = require('./authentication.js');
var flash = require('connect-flash');
var passport = require('passport');
//var logger = require("./logger.js");

module.exports = function (app, db, config) {
  var env = process.env.NODE_ENV || 'development';

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', [
    config.root + '/app/views',
    config.root + '/app/views/commander',  
    config.root + '/app/views/admin', 
    config.root + '/app/views/user']);
  app.set('view engine', 'ejs');
  
  app.use(require('morgan')("dev")); //, {"stream": logger.stream }));
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'SOMERANDOMSECRETHERE', 
    cookie: { maxAge: 3600*60000 }
  }));
  app.use(flash());
  
  app.use(function (req, res, next) {
      req.pagetitle = config.app.name;
      next();
  });
  
  app.use(express.static( config.root + '/public'));
  app.use(methodOverride());

  require('./authentication.js')(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/', require('./../app/controllers/base.js')(passport));	
  app.use('/user', require('./../app/controllers/user.js')(passport));
  app.use('/commander', require('./../app/controllers/commander.js')(passport));
  app.use('/admin', require('./../app/controllers/admin.js')(passport));
  app.use('/api/user', require('./../app/controllers/api-user.js')(passport));
  app.use('/api/commander', require('./../app/controllers/api-commander.js')(passport));
  app.use('/api/admin', require('./../app/controllers/api-admin.js')(passport));
 

  app.use(function (req, res, next) {
    var err = new Error('Ooops gess that wasn\'t suposed to hapen');
    err.status = 404;
    next(err);
  });

  if (app.locals.ENV_DEVELOPMENT) {
    app.use(function (err, req, res, next) {
      var Response = new (require('./../app/response/error-response.js'))(req,err);
      res.status(err.status || 500);
      res.render('error', Response);
    });
  } else {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      var Response = new (require('./../app/response/error-response.js'))(req,err);
      res.render('error', Response);
    });
  }
};


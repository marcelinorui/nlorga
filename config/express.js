var express = require('express');
var session = require('express-session');
var glob = require('glob');
var crypto = require('crypto');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var passport = require('./authentication.js');
//var flash = require('connect-flash');
var passport = require('passport');

module.exports = function (app, db, config) {
  var env = process.env.NODE_ENV || 'development';

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/views');
  app.set('view engine', 'ejs');
  
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'SOMERANDOMSECRETHERE', 
    cookie: { maxAge: 3600*60000 }
  }));
  app.use(express.static( config.root + '/public'));

  app.use(methodOverride());

  require('./authentication.js')(passport);
  app.use(passport.initialize());
  app.use(passport.session());


  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app, passport);
  });

  app.use(function (req, res, next) {
    var err = new Error('Ooops gess that wasn\'t suposed to hapen');
    err.status = 404;
    next(err);
  });

  if (app.locals.ENV_DEVELOPMENT) {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        user: req.user,
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  } else {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        user: req.user,
        message: err.message,
        error: {},
        title: 'error'
      });
    });
  }
};


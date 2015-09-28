var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models');

var app = express();

require('./config/express')(app, db, config);

db.start(function () {
    app.listen(config.port, function () {
      console.log('Express server listening on port ' + config.port);
    });
  });


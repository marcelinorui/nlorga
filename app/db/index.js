'use strict';

var fs = require('fs')
  , path = require('path')
  , mysql = require('mysql')
  , basename = path.basename(module.filename)
  , env = process.env.NODE_ENV || 'development'
  , config = require(__dirname + '/../../config/config.js');

/* Load All Modules */
var db = {
  pool: null,
  start: function (fn) {
    var self = this;
    self.pool = mysql.createPool({
      connectionLimit: 100,
      host: config.db.host,
      user: config.db.username,
      password: config.db.password,
      database: config.db.database,
      multipleStatements: true,
      debug: false
    });

    fs.readdirSync(__dirname)
      .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
      })
      .forEach(function (file) {
        if (file.slice(-3) !== '.js') return;
        var DB = require(path.join(__dirname, file));
        db[file.replace('.js', '')] = new DB(self.pool);
      });

    fn();
  }
};

module.exports = db;

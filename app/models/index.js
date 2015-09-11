'use strict';

var fs        = require('fs');
var path      = require('path');
var mysql = require('mysql');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../../config/config.js');

var db        = {
  pool: null,
  start: function(fn){
    var self = this;
        self.pool = mysql.createPool({
          connectionLimit: 100,
          host: config.db.host,
          user: config.db.username,
          password: config.db.password,
          database: config.db.database,
          debug: false
        });        
        
         fs
           .readdirSync(__dirname)
           .filter(function(file) {
             return (file.indexOf('.') !== 0) && (file !== basename);
           })
           .forEach(function(file) {
             if (file.slice(-3) !== '.js') return;
               var Model = require(path.join(__dirname, file));
               db[file.replace('.js','')] = new Model(self.pool);
             });     
        
        fn();
  }
};

/* Add Relations Between Models */

module.exports = db;

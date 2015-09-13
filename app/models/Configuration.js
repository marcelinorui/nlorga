var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function Configuration(db){
	Base.apply(this,arguments);
};

util.inherits(Configuration, Base);

Configuration.prototype.getActivePartyConfiguration = function(callback){
	var sql = 'CALL getActivePartyConfiguration()';
	var params = [];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var out = self.getTable(rows,fields);
			callback(err, out);
		} else {
			callback(err,null);
		}
	});
};

module.exports = Configuration;
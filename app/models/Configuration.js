var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function Configuration(db){
	Base.apply(this,arguments);
};

util.inherits(Configuration, Base);

Configuration.prototype.createOrganization = function(callback){
	var sql = 'CALL createOrganization()';
	var params = [ ];
	var query = mysql.format(sql,params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err,null);
		}
	});
};

module.exports = Configuration;
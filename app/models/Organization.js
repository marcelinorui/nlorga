var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function Organization(db){
	Base.apply(this,arguments);
};

util.inherits(Organization, Base);

Organization.prototype.createOrganization = function(callback){
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

module.exports = Organization;
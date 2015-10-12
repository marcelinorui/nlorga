var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js');

function Roles(db){
	Base.apply(this,arguments);
};

util.inherits(Roles, Base);

Roles.prototype.getRoles = function(callback){
	var sql = 'CALL getroles()';
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

module.exports = Roles;
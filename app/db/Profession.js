var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function Profession(db){
	Base.apply(this,arguments);
};

util.inherits(Profession, Base);

Profession.prototype.getallprofessions = function(callback){
	var self = this;
	var sql = 'CALL getallprofessions()';
	var params = [];
	var query = mysql.format(sql,params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var out = self.getFields(rows,fields);
			callback(err, out);
		} else {
			callback(err,null);
		}
	});
};

module.exports = Profession;
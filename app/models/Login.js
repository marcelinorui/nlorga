var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function Login(db){
	Base.apply(this,arguments);
};

util.inherits(Login, Base);

Login.prototype.verifyLogin = function( username, password, callback){
	var self = this;
	var sql = 'CALL verifyLogin(?,?)';
	var params = [ username, password];
	var query = mysql.format(sql,params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var out = self.getFields(rows,fields);
			callback(err, out[0]);
		} else {
			callback(err,null);
		}
	});
};

module.exports = Login;
var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function User(db) {
	Base.apply(this, arguments);
};

util.inherits(User, Base);

User.prototype.updateLoginPassword = function (username, password, callback) {
	var sql = 'CALL updateLoginPassword(?,?)';
	var params = [username, password];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, "ok");
		} else {
			callback(err, null);
		}
	});
};


User.prototype.changeUserProfile = function (idlogin, displayname, hascommanderTag, professions, callback) {
	var sql = 'CALL changeUserProfile(?,?,?,?,?)';
	var params = [idlogin, displayname, hascommanderTag == 1 ? true:false, professions.join(';'), ';'];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, "ok");
		} else {
			callback(err, null);
		}
	});
};

User.prototype.getUserProfessions = function (idlogin, callback) {
	var self = this;
	var sql = 'CALL getUserProfessions(?)';
	var params = [idlogin];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var out = self.getFields(rows, fields);
			callback(err, out);
		} else {
			callback(err, null);
		}
	});
};




module.exports = User;
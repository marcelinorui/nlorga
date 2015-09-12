var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function User(db) {
	Base.apply(this, arguments);
};

util.inherits(User, Base);

User.prototype.changeLoginPassword = function (idlogin, password, callback) {
	var sql = 'CALL changeLoginPassword(?,?)';
	var params = [idlogin, password];
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

User.prototype.getUserProfile = function (idlogin, callback) {
	var self = this;
	var sql = 'CALL getUserProfile(?)';
	var params = [idlogin];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var out = { 
				user: self.getTable(rows, fields, 0)[0],
				professions: self.getTable(rows, fields, 1)
			}
			callback(err, out);
		} else {
			callback(err, null);
		}
	});
};

module.exports = User;
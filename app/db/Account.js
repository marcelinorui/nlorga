var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function Account(db){
	Base.apply(this,arguments);
};

util.inherits(Account, Base);


Account.prototype.listAccounts = function( where , order, parameters, itemsPerPage, currentPage, callback){
	this.paginateQuery('login' , 
	['idlogin','username','displayname','hascommanderTag','idrole','createddate','updateddate','enddate'], 
	where ,
	order, 
	parameters,
	itemsPerPage,
	currentPage,
	callback); 
};

Account.prototype.getAccount = function(idlogin, callback){
	var sql = 'CALL getAccount(?)';
	var params = [idlogin];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var out = self.getFirstRow(rows,fields,0);
			callback(err, out);
		} else {
			callback(err, null);
		}
	});
};

Account.prototype.createAccount = function(username,password,displayname,salt,hascommanderTag,isAdmin,callback){
	var sql = 'CALL createAccount(?,?,?,?,?,?)';
	var params = [username,password,displayname,salt,hascommanderTag,isAdmin];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, "ok");
		} else {
			callback(err, null);
		}
	});
};


Account.prototype.updateAccount = function(idlogin,username,displayname,hascommanderTag,isAdmin,forDelete,callback){
	var sql = 'CALL updateAccount(?,?,?,?,?,?)';
	var params = [idlogin,username,displayname,hascommanderTag,isAdmin,forDelete];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, "ok");
		} else {
			callback(err, null);
		}
	});
};

module.exports = Account;
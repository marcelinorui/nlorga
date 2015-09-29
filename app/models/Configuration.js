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

Configuration.prototype.getConfiguration = function (idpartyconfiguration, callback){
	var sql = 'CALL getConfiguration(?)';
	var params = [idpartyconfiguration];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var out = self.getFirstRow(rows,fields);
			out.profession = self.getTable(rows,fields,1);
			callback(err, out);
		} else {
			callback(err,null);
		}
	});
};

Configuration.prototype.listConfigurations = function( where , order, parameters, itemsPerPage, currentPage, callback){
	this.paginateQuery('PartyConfiguration', 
	['idpartyconfiguration','description','pickfood','pickbanner','pickcommander','createddate','updateddate','enddate'], 
	where ,
	order, 
	parameters,
	itemsPerPage,
	currentPage,
	callback); 
};

Configuration.prototype.createConfiguration = function(description,jsviewname,pickbanner,pickfood,pickcommander, callback){
	var sql = 'CALL createConfiguration(?,?,?,?,?)';
	var params = [description,jsviewname,pickbanner,pickfood,pickcommander];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var id = self.getSingle(rows, fields);
			callback(err, id);
		} else {
			callback(err,null);
		}
	});
};

module.exports = Configuration;
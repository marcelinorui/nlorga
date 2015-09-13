var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js');

function Organization(db){
	Base.apply(this,arguments);
};

util.inherits(Organization, Base);

Organization.prototype.createOrganization = function(idpartyconfiguration,title,callback){
	var sql = 'CALL createOrganization(?,?)';
	var params = [ idpartyconfiguration, title];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var id = self.getSingle(rows,fields);
			callback(err, id);
		} else {
			callback(err,null);
		}
	});
};

Organization.prototype.getOrganization = function(idorganization,callback){
	var sql = 'CALL getOrganization(?)';
	var params = [ idorganization ];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var organization = self.getFirstRow(rows,fields);
		
			if (organization.idstatus == 1){
				organization.partyconfiguration = self.getTable(rows,fields,1);
			}
			if (organization.idstatus == 2){
				
			}
			if (organization.idstatus == 3){
				
			}
			if (organization.idstatus == 4){
				
			}
			if (organization.idstatus == 5){
				
			}
			
			callback(err, organization);
		} else {
			callback(err,null);
		}
	});
};


Organization.prototype.updateOrganization = function(idorganization,title,idpartyconfiguration,callback){
	var sql = 'CALL updateOrganization(?,?,?)';
	var params = [ idorganization,title,idpartyconfiguration];
	var query = mysql.format(sql,params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err,null);
		}
	});	
};

Organization.prototype.resetOrganization = function(idorganization,callback){
	var sql = 'CALL resetOrganization(?)';
	var params = [ idorganization ];
	var query = mysql.format(sql,params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err,null);
		}
	});	
};

Organization.prototype.moveStatusOrganization = function(idorganization,idstatus,callback){
	var sql = 'CALL moveStatusOrganization(?,?)';
	var params = [ idorganization,idstatus ];
	var query = mysql.format(sql,params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err,null);
		}
	});
};

Organization.prototype.getRegistrys = function(idorganization,callback){
	var sql = 'CALL getRegistrys(?)';
	var params = [ idorganization ];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var registrys = self.getTable(rows,fields);
			callback(err, registrys);
		} else {
			callback(err,null);
		}
	});
};

Organization.prototype.getPartys = function(idorganization,callback){
	var sql = 'CALL getPartys(?)';
	var params = [ idorganization ];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var registrys = self.getTable(rows,fields);
			callback(err, registrys);
		} else {
			callback(err,null);
		}
	});
};

Organization.prototype.listOrganizations = function( where , order, parameters, itemsPerPage, currentPage, callback){
	this.paginateQuery('organization o inner join status s on o.idstatus = s.idstatus inner join partyconfiguration p on p.idpartyconfiguration = o.idpartyconfiguration' , ['o.idorganization','o.title','s.description as status','p.description' , 'o.createddate','o.updateddate'], where ,order, parameters,itemsPerPage,currentPage,callback); 
};


module.exports = Organization;
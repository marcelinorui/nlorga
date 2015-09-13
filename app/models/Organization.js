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
			var partyconfiguration = null;
			if (organization.idstatus == 1){
				partyconfiguration = self.getTable(rows,fields,1);
			}
			callback(err, organization,partyconfiguration);
		} else {
			callback(err,null);
		}
	});
};

Organization.prototype.listOrganizations = function( where , order, parameters, itemsPerPage, currentPage, callback){
	this.paginateQuery('organization o inner join status s on o.idstatus = s.idstatus inner join partyconfiguration p on p.idpartyconfiguration = o.idpartyconfiguration' , ['o.idorganization','o.title','s.description as status','p.description' , 'o.createddate','o.updateddate'], where ,order, parameters,itemsPerPage,currentPage,callback); 
};


module.exports = Organization;
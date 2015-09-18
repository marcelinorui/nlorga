var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js'),
	_ = require('lodash');

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
			var data = {};
			
			data.organization = self.getFirstRow(rows,fields);
			
			switch(data.organization.idstatus){
				case 1:
					data.partyconfiguration = self.getTable(rows,fields,1);
					break;
				case 2:
				case 3:
					data.registrys = self.getTable(rows,fields,1);
					data.statistic = self.getTable(rows,fields,2);
					break;
				case 4:
				case 5:
				case 6:
					var partys = self.getTable(rows,fields,1);
					
					data.partys = _.map(_.keys(_.groupBy(partys,'partyname')),function(partyname){ 
						var aux = { 
							partyname: partyname, 
							members: _.filter(partys, function(p){
								return p.partyname == partyname; 
							}) 
						};
						return aux;
					});
					data.statistic = self.getTable(rows,fields,2);
					break;
			}			
						
			callback(err, data);
		} else {
			callback(err,null);
		}
	});
};

Organization.prototype.addPartys = function(partys,callback){
	var sql = 'INSERT INTO organizationparty (`idorganization`, `idpartyname`, `idregistry`, `createddate`) values  ?';
	var params = partys;
	var query = mysql.format(sql,[params]);
	console.log(query);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
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

Organization.prototype.getRegistrysForPartys = function(idorganization,callback){
	var sql = 'CALL getRegistrysForPartys(?)';
	var params = [ idorganization ];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var output = {
				registrys : self.getTable(rows,fields,0),
				partynames: self.getTable(rows,fields,1)
			};
			callback(err, output);
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

Organization.prototype.cleanPartys = function(idorganization,callback){
	var sql = 'CALL cleanPartys(?)';
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

Organization.prototype.listOrganizations = function( where , order, parameters, itemsPerPage, currentPage, callback){
	this.paginateQuery('organization o inner join status s on o.idstatus = s.idstatus inner join partyconfiguration p on p.idpartyconfiguration = o.idpartyconfiguration' , ['o.idorganization','o.title','s.description as status','p.description' , 'o.createddate','o.updateddate'], where ,order, parameters,itemsPerPage,currentPage,callback); 
};

Organization.prototype.getUserOrganizationConfiguration = function(idorganization,idlogin, callback){
	var sql = 'CALL getUserOrganizationConfiguration(?,?)';
	var params = [idorganization, idlogin];
	var query = mysql.format(sql,params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var registrys = { 
				user : self.getFirstRow(rows,fields), 
				professions : self.getTable(rows,fields,1)
			};
			callback(err, registrys);
		} else {
			callback(err,null);
		}
	});	
}
module.exports = Organization;
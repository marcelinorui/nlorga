var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js'),
    utils = require('./../utils/utils.js'),
	_ = require('lodash');

function Organization(db) {
	Base.apply(this, arguments);
};

util.inherits(Organization, Base);

Organization.prototype.createOrganization = function (idpartyconfiguration, title, callback) {
	var sql = 'CALL createOrganization(?,?)';
	var params = [idpartyconfiguration, title];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var id = self.getSingle(rows, fields);
			callback(err, id);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.getOrganization = function (idorganization, callback) {
	var sql = 'CALL getOrganization(?)';
	var params = [idorganization];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var data = {};

			data.organization = self.getFirstRow(rows, fields);

			switch (data.organization.idstatus) {
				case 1:
					data.partyconfiguration = self.getTable(rows, fields, 1);
					break;
				case 2:
				case 3:
					data.registry = self.getTable(rows, fields, 1);
					data.statistic = self.getTable(rows, fields, 2);
					break;
				case 4:
				case 5:
				case 6:
					var partys = self.getTable(rows, fields, 1);

					data.partys = _.map(_.keys(_.groupBy(partys, 'partyname')), function (partyname) {
						var aux = {
							partyname: partyname,
							members: _.filter(partys, function (p) {
								return p.partyname == partyname;
							})
						};
						return aux;
					});
					data.statistic = self.getTable(rows, fields, 2);
					break;
			}

			callback(err, data);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.addPartys = function (partys, callback) {
	var sql = 'INSERT INTO organizationparty (`idorganization`, `idpartyname`, `idregistry`, `createddate`) values  ?';
	var params = partys;
	var query = mysql.format(sql, [params]);
	console.log(query);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.addOrganizationUser = function (idorganization, idlogin, idprofession, havefood, havebanner, havetag, callback) {
	var sql = 'CALL addOrganizationUser(?,?,?,?,?,?)';
	var params = [idorganization, idlogin, idprofession, havefood, havebanner, havetag];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err, null);
		}
	});
}

Organization.prototype.updateOrganization = function (idorganization, title, idpartyconfiguration, callback) {
	var sql = 'CALL updateOrganization(?,?,?)';
	var params = [idorganization, title, idpartyconfiguration];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.resetOrganization = function (idorganization, callback) {
	var sql = 'CALL resetOrganization(?)';
	var params = [idorganization];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.moveStatusOrganization = function (idorganization, idstatus, callback) {
	var sql = 'CALL moveStatusOrganization(?,?)';
	var params = [idorganization, idstatus];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.getRegistrys = function (idorganization, callback) {
	var sql = 'CALL getRegistrys(?)';
	var params = [idorganization];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var registrys = self.getTable(rows, fields);
			callback(err, registrys);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.getRegistrysForPartys = function (idorganization, callback) {
	var sql = 'CALL getRegistrysForPartys(?)';
	var params = [idorganization];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var output = {
				registrys: self.getTable(rows, fields, 0),
				partynames: self.getTable(rows, fields, 1)
			};
			callback(err, output);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.getPartys = function (idorganization, callback) {
	var sql = 'CALL getPartys(?)';
	var params = [idorganization];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var registrys = self.getTable(rows, fields);

			var partys = _.map(_.groupBy(registrys, 'partyname'), function (value, key) {
				var aux = {
					partyname: key,
					members: value
				};
				return aux;
			});

			callback(err, partys);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.cleanPartys = function (idorganization, callback) {
	var sql = 'CALL cleanPartys(?)';
	var params = [idorganization];
	var query = mysql.format(sql, params);
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			callback(err, 'ok');
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.listOrganizations = function (where, order, parameters, itemsPerPage, currentPage, callback) {
	this.paginateQuery('organization o inner join status s on o.idstatus = s.idstatus inner join partyconfiguration p on p.idpartyconfiguration = o.idpartyconfiguration', ['o.idorganization', 'o.title', 's.description as status', 'p.description', 'o.createddate', 'o.updateddate'], where, order, parameters, itemsPerPage, currentPage, callback);
};

Organization.prototype.getUserOrganizationConfiguration = function (idorganization, idlogin, callback) {
	var sql = 'CALL getUserOrganizationConfiguration(?,?)';
	var params = [idorganization, idlogin];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var registrys = {
				user: self.getFirstRow(rows, fields),
				professions: self.getTable(rows, fields, 1)
			};
			callback(err, registrys);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.getActiveOrganizations = function (idlogin, callback) {
	var sql = 'CALL getActiveOrganizations(?)';
	var params = [idlogin];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var organizations = self.getTable(rows, fields);
			callback(err, organizations);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.getOrganizationForUser = function (idorganization, idlogin, callback) {
	var sql = 'CALL getOrganizationForUser(?,?)';
	var params = [idorganization, idlogin];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var tables = self.getTables(rows, fields);

			var data = {};
			data.options = {
				user: self.getFirstRow(rows, fields, 0),
				userprofessions: self.getTable(rows, fields, 1),
				registry: self.getFirstRow(rows, fields, 2)
			};

			data.organization = self.getFirstRow(rows, fields, 3);
			switch (data.organization.idstatus) {
				case 1:

					data.partyconfiguration = self.getFirstRow(rows, fields, 4);
					break;
				case 2:
				case 3:
					data.registry = self.getTable(rows, fields, 4);
					data.statistic = self.getTable(rows, fields, 5);
					break;
				case 4:
					data.registry = self.getTable(rows, fields, 4);
					var partys = self.getTable(rows, fields, 5);
					data.partys = _.map(_.keys(_.groupBy(partys, 'partyname')), function (partyname) {
						var aux = {
							partyname: partyname,
							members: _.filter(partys, function (p) {
								return p.partyname == partyname;
							})
						};
						return aux;
					});
					data.statistic = self.getTable(rows, fields, 6);
					break;
				case 5:
				case 6:
					var partys = self.getTable(rows, fields, 4);
					data.partys = _.map(_.keys(_.groupBy(partys, 'partyname')), function (partyname) {
						var aux = {
							partyname: partyname,
							members: _.filter(partys, function (p) {
								return p.partyname == partyname;
							})
						};
						return aux;
					});
					data.statistic = self.getTable(rows, fields, 5);
					break;
			}

			callback(err, data);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.getOrganizationStatus = function (idorganization, callback) {
	var sql = 'CALL getOrganizationStatus(?)';
	var params = [idorganization];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var status = self.getFirstRow(rows, fields);
			callback(err, status);
		} else {
			callback(err, null);
		}
	});
};

Organization.prototype.makeOrganizationPartys = function (idorganization, groupSize, callback) {
	/*var sql = 'CALL makeOrganizationPartys(?,?)';
	var params = [idorganization, groupSize];
	var query = mysql.format(sql, params);
	
	this.db.query(query, function (err, rows, fields) {
		if(!err){
			callback(err, 'ok');
		} else {
			callback(err, null);
		}
	});*/
	var self = this;
	self.getRegistrysForPartys(idorganization, function (err, registrys) {
		if (!err) {							
			//make the partys						
			var partys = utils.makePartys(registrys, groupSize, idorganization);
			//insert the partys into DB
			self.cleanPartys(idorganization, function (err, data) {
				if (!err) {
					self.addPartys(partys, function (err, ok) {
						return callback(err, ok);
					});
				} else {
					return callback(err,null);
				}
			});
		} 
		return callback(err,null);
	});
};

module.exports = Organization;
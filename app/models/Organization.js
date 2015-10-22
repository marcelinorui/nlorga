var db = require('./../db/index.js'),
	utils = require('./../utils/utils.js');

module.exports.list = function (req, res, next) {
	db.Organization.listOrganizations('', '', null, null, null, function (err, organizations) {
		if (!err) {
			req.session.organizations = organizations;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};

module.exports.create = function (req, res, next) {
	db.Configuration.getActivePartyConfiguration(function (err, partyconfiguration) {
		if (!err) {
			req.session.partyconfiguration = partyconfiguration;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};

module.exports.insert = function (req, res, next) {
	var idpartyconfiguration = req.body['partyconfiguration'];
	var title = req.body['title'];
	db.Organization.createOrganization(idpartyconfiguration, title, function (err, idorganization) {
		if (!err) {
			req.session.idorganization = idorganization;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};


module.exports.get = function (req, res, next) {
	var idorganization = req.params.id;
	db.Organization.getOrganizationForUser(idorganization, req.user.idlogin, function (err, organization) {
		if (!err) {
			req.session.organization = organization;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};


module.exports.update = function (req, res, next) {
	var idorganization = req.params.id;
	var title = req.body['title'];
	var idpartyconfiguration = req.body['idpartyconfiguration'];
	db.Organization.updateOrganization(
		idorganization,
		title,
		idpartyconfiguration,
		function (err, ok) {
			if (!err) {
				req.flash('success', 'The organization changed successfuly.')
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next();
		});
};


module.exports.status = function (req, res, next) {
	if (req.params.idstatus == -1) {
		db.Organization.resetOrganization(req.params.id, function (err, ok) {
			if (!err) {
				req.flash('success', 'The organization was reseted successfuly.');
			}
			return next(err);
		});
	} else
		if (req.params.idstatus == -2) {
			db.Organization.makeOrganizationPartys(req.params.id, Number(req.body['partysize']), function (err, ok) {
				if (!err) {
					req.session.partysize = Number(req.body['partysize']);
					req.session.idstatus = idstatus;
					req.flash('success', 'The Partys were remaded.');
				}
				return next(err);
			});
		} else {
			var idstatus = req.params.idstatus;
			idstatus = idstatus > 5 ? 5 : idstatus;
			if (idstatus == 3) {
				var partysize = Number(req.body['partysize']);
				db.Organization.makeOrganizationPartys(req.params.id, partysize, function (err, ok) {
					if (!err) {
						db.Organization.moveStatusOrganization(req.params.id, idstatus, function (err, ok) {
							if (!err) {
								req.session.partysize = partysize;
								req.session.idstatus = idstatus;
								req.flash('success', 'The Organization status changed successfuly.');
							} else {
								req.flash('error', 'SQL Error.')
							}
							return next(err);
						});
					} else {
						req.flash('error', 'SQL Error.')
						return next(err);
					}
				});
			} else {
				var partialtime = req.body.partialtime ? req.body.partialtime : '' ;
				var endtime = req.body.endtime ? req.body.endtime : '';
				db.Organization.moveStatusOrganization(req.params.id,partialtime,endtime, idstatus, function (err, ok) {
					if (!err) {
						req.session.idstatus = idstatus;
						req.flash('success', 'The Organization status changed successfuly.');
					} else {
						req.flash('error', 'SQL Error.')
					}
					return next(err);
				});
			}
		}
};

module.exports.userList = function(req,res,next){
	db.Organization.getActiveOrganizations(req.user.idlogin, function (err, organizations) {
			if (!err) {
				req.session.organizations = organizations;
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
};

module.exports.view = function (req, res, next) {
	db.Organization.getOrganizationForUser(req.params.id, req.user.idlogin, function (err, organization) {
		if (!err) {
			req.session.organization = organization;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};
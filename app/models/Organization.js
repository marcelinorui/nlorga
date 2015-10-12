var db = require('./../db/index.js'),
	utils = require('./../utils/utils.js');

module.exports.listUrl = '/organizations';
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
module.exports.listResponse = function (req, res, next) {
	var Response = require('./../response/admin-organizations-response.js');
	res.render('admin-organizations', new Response(req));
};

module.exports.createUrl = '/organization/create'
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
module.exports.createResponse = function (req, res, next) {
	var Response = require('./../response/admin-organization-create-response.js');
	res.render('admin-organization-create', new Response(req))
};

module.exports.insertUrl = '/organization/create';
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

module.exports.insertResponse = function (req, res, next) {
	res.redirect('/admin/organization/' + req.session.idorganization + '/edit');
	req.session.idorganization = null;
};

module.exports.getUrl = '/organization/:id/edit'
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
module.exports.getResponse = function (req, res, next) {
	var Response = require('./../response/admin-organization-edit-response.js');
	res.render('admin-organization-edit', new Response(req));
};


module.exports.updateUrl = '/organization/:id/edit';
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
module.exports.updateResponse = function (req, res, next) {
	res.redirect('/admin/organization/' + req.params.id + '/edit');
};

module.exports.statusUrl = '/organization/:id/status/:idstatus';
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
							}
							return next(err);
						});
					} else {
						return next(err);
					}
				});
			} else {
				db.Organization.moveStatusOrganization(req.params.id, idstatus, function (err, ok) {
					if (!err) {
						req.session.idstatus = idstatus;
						req.flash('success', 'The Organization status changed successfuly.');
					}
					return next(err);
				});
			}
		}
};
module.exports.statusResponse = function (req, res, next) {
	res.redirect('/admin/organization/' + req.params.id + '/edit');
};
var express = require('express'),
	db = require('./../db/index.js'),
	utils = require('./../utils/utils.js'),
	account = require('./../models/Account.js');



function admin(passport) {
	var router = express.Router();

	router.use(require('../utils/auth.js').isAdminAuthenticated);

	router.get('/', function (req, res, next) {
		var Response = require('./../response/admin-accounts-response.js');
		res.render('admin', new Response(req));
	});

	router.get(account.listUrl, account.list, account.listResponse);
	router.get(account.getUrl, account.get, account.getResponse);
	router.post(account.updateUrl,account.update, account.updateResponse);
	router.get(account.createUrl,account.create,account.createResponse);
	router.post(account.insertUrl, account.insert,account.insertResponse);  

	router.get('/organizations', function (req, res, next) {
		db.Organization.listOrganizations('', '', null, null, null, function (err, organizations) {
			if (!err) {
				req.session.organizations = organizations;
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
	}, function (req, res, next) {
		var Response = require('./../response/admin-organizations-response.js');
		res.render('admin-organizations', new Response(req))
	});

	router.get('/organization/create', function (req, res, next) {

		db.Configuration.getActivePartyConfiguration(function (err, partyconfiguration) {
			if (!err) {
				req.session.partyconfiguration = partyconfiguration;
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
	},
		function (req, res, next) {
			var Response = require('./../response/admin-organization-create-response.js');
			res.render('admin-organization-create', new Response(req))
		});

	router.post('/organization/create', function (req, res, next) {
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
	}, function (req, res, next) {
		res.redirect('/admin/organization/' + req.session.idorganization + '/edit');
		req.session.idorganization = null;
	});

	router.get('/organization/:id/edit', function (req, res, next) {
		var idorganization = req.params.id;
		db.Organization.getOrganizationForUser(idorganization,req.user.idlogin, function (err, organization) {
			if (!err) {
				req.session.organization = organization;
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
	}, function (req, res, next) {
		var Response = require('./../response/admin-organization-edit-response.js');
		res.render('admin-organization-edit', new Response(req))
	});

	router.post('/organization/:id/edit', function (req, res, next) {
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
	}, function (req, res, next) {
		res.redirect('/admin/organization/' + req.params.id + '/edit');
	});

	router.post('/organization/:id/status/:idstatus', function (req, res, next) {
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
						req.session.idstatus = idstatus;
						req.flash('success', 'The Partys were remaded.');
					}
					return next(err);
				});
			} else {
				var idstatus = req.params.idstatus;
				idstatus = idstatus > 5 ? 5 : idstatus;
				if (idstatus == 3) {
					db.Organization.makeOrganizationPartys(req.params.id, Number(req.body['partysize']), function (err, ok) {
						if (!err) {
							db.Organization.moveStatusOrganization(req.params.id, idstatus, function (err, ok) {
								if (!err) {
									req.session.idstatus = idstatus;
									req.flash('success', 'The Organization status changed successfuly.');
								}
								return next(err);
							});
						}
						return next(err);
					});
				} else {
					db.Organization.moveStatusOrganization(req.params.id, idstatus, function (err, ok) {
						if (!err) {
							req.session.idstatus = idstatus;
							req.flash('success', 'The Organization status changed successfuly.');
						} else {

						}
						return next(err);
					});
				}
			}
	}, function (req, res, next) {
		res.redirect('/admin/organization/' + req.params.id + '/edit');
	});



	router.get('/configurations', function (req, res, next) {
		db.Configuration.listConfigurations('', '', null, null, null, function (err, configurations) {
			if (!err) {
				req.session.configurations = configurations;
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
	}, function (req, res) {
		var Response = require('./../response/admin-configurations-response.js');
		res.render('admin-configurations', new Response(req))
	});
	

	router.get('/configuration/:id/edit', function (req, res, next) {
		db.Configuration.getConfiguration(req.params.id,function(err, configuration){
			if (!err) {
				req.session.configuration = configuration;
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
	}, function (req, res, next) {
		var Response = require('./../response/admin-configuration-edit-response.js');
		res.render('admin-configuration-edit', new Response(req))
	});

	router.get('/configuration/create', function (req, res, next) {
		var Response = require('./../response/admin-configuration-create-response.js');
		res.render('admin-configuration-create', new Response(req))
	});
	
	router.post('/configuration/create', function(req,res,next){
		var pickbanner = req.body['pickbanner'] ? 1 : 0;
		var pickfood = req.body['pickfood'] ? 1 : 0;
		var pickcommander = req.body['pickcommander'] ? 1 : 0;
		var description = req.body['description'];
		var jsviewname = req.body['jsviewname'];
		
		db.Configuration.createConfiguration(description,jsviewname,pickbanner,pickfood,pickcommander,function(err,idconfiguration){
			if (!err) {
				req.session.idconfiguration = idconfiguration;
				req.flash('success', 'Configuration created successfully.');
			} else {
				req.flash('error', 'SQL Error.');
			}
			return next(err);
		});
		
	}, function (req, res, next) {
		res.redirect('/admin/configuration/'+req.session.idconfiguration+'/edit');
	});

	return router;
}


module.exports = admin; 	

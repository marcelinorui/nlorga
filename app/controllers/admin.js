var express = require('express'),
	db = require('./../models/index.js'),
	utils = require('./../utils/utils.js');


function isAdminAuthenticated(req, res, next) {
	return next();
	if (req.isAuthenticated()) {
		if (req.user.isAdmin === true) {
			return next();
		} else {
			res.redirect('/no-permitions');
		}
	}
	else {
		res.redirect('/login');
	}
};

function admin(passport) {
	var router = express.Router();

	router.get('/', isAdminAuthenticated, function (req, res, next) {
		var Response = require('./../response/admin-accounts-response.js');
		res.render('admin', new Response(req));
	});

	router.get('/accounts', isAdminAuthenticated, function (req, res, next) {
		db.Account.listAccounts('', '', null, null, null, function (err, accounts) {
			if (!err) {
				req.session.accounts = accounts;
			}
			return next(err);
		});
	}, function (req, res) {
		var Response = require('./../response/admin-accounts-response.js');
		res.render('admin-accounts', new Response(req))
	});

	router.get('/account/:id/edit', isAdminAuthenticated, function (req, res, next) {
		db.Account.getAccount(req.params.id, function (err, account) {
			if (!err) {
				req.session.account = account;
			}
			return next(err);
		})
	}, function (req, res, next) {
		var Response = require('./../response/admin-account-edit-response.js');
		res.render('admin-account-edit', new Response(req));
	});

	router.post('/account/:id/edit', isAdminAuthenticated, function (req, res, next) {
		var account = {
			idlogin: req.params.id,
			username: req.body.username,
			displayname: req.body['displayname'] ? req.body.displayname : '',
			hascommanderTag: req.body['hascommanderTag'] ? 1 : 0,
			isAdmin: req.body['isAdmin'] ? 1 : 0,
			forDelete: req.body['forDelete'] ? 1 : 0
		};

		db.Account.updateAccount(
			account.idlogin,
			account.username,
			account.displayname,
			account.hascommanderTag,
			account.isAdmin,
			account.forDelete,
			function (err, ok) {
				if (!err) {
					req.flash('success', 'Account changed successfully.');
				}
				return next(err);
			})
	}, function (req, res, next) {
		res.redirect('/admin/account/' + req.params.id + '/edit');
	});

	router.get('/account/create', isAdminAuthenticated, function (req, res, next) {
		var Response = require('./../response/admin-account-create-response.js');
		res.render('admin-account-create', new Response(req));
	});

	router.post('/account/create', isAdminAuthenticated, function (req, res, next) {
		var code = utils.createHashAndSalt(req.body.password);
		var account = {
			username: req.body.username,
			password: code.hash.toString('utf8'),
			displayname: req.body['displayname'] ? req.body.displayname : '',
			salt: code.salt.toString('utf8'),
			hascommanderTag: req.body['hascommanderTag'] ? 1 : 0,
			isAdmin: req.body['isAdmin'] ? 1 : 0
		};

		db.Account.createAccount(
			account.username,
			account.password,
			account.displayname,
			account.salt,
			account.hascommanderTag,
			account.isAdmin
			, function (err, ok) {
				if (!err) {
					req.flash('success', 'A new account was created successfully.');
				}
				next(err);
			});
	}, function (req, res) {
		res.redirect('/admin/accounts');
	});

	router.get('/organizations', isAdminAuthenticated, function (req, res, next) {
		db.Organization.listOrganizations('', '', null, null, null, function (err, organizations) {
			if (!err) {
				req.session.organizations = organizations;
			}
			return next(err);
		});
	}, function (req, res, next) {
		var Response = require('./../response/admin-organizations-response.js');
		res.render('admin-organizations', new Response(req))
	});

	router.get('/organization/create', isAdminAuthenticated, function (req, res, next) {

		db.Configuration.getActivePartyConfiguration(function (err, partyconfiguration) {
			if (!err) {
				req.session.partyconfiguration = partyconfiguration;
			}
			return next(err);
		});
	},
		function (req, res, next) {
			var Response = require('./../response/admin-organization-create-response.js');
			res.render('admin-organization-create', new Response(req))
		});

	router.post('/organization/create', isAdminAuthenticated, function (req, res, next) {
		var idpartyconfiguration = req.body['partyconfiguration'];
		var title = req.body['title'];
		db.Organization.createOrganization(idpartyconfiguration, title, function (err, idorganization) {
			if (!err) {
				req.session.idorganization = idorganization;
			}
			return next(err);
		});
	}, function (req, res, next) {
		res.redirect('/admin/organization/' + req.session.idorganization + '/edit');
		req.session.idorganization = null;
	});

	router.get('/organization/:id/edit', isAdminAuthenticated, function (req, res, next) {
		var idorganization = req.params.id;
		db.Organization.getOrganization(idorganization, function (err, organization) {
			if (!err) {
				req.session.organization = organization;
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
	},
		function (req, res, next) {
			var Response = require('./../response/admin-organization-edit-response.js');
			res.render('admin-organization-edit', new Response(req))
		});

	router.post('/organization/:id/edit', isAdminAuthenticated, function (req, res, next) {
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
	},
		function (req, res, next) {
			res.redirect('/admin/organization/' + req.params.id + '/edit');
		});

	router.post('/organization/:id/status/:idstatus', isAdminAuthenticated, function (req, res, next) {
		if (req.params.idstatus == -1) {
			db.Organization.resetOrganization(req.params.id, function (err, ok) {
				if (!err) {
					req.flash('success', 'The organization was reseted successfuly.');
				}
				return next(err);
			});
		} else
			if (req.params.idstatus == -2) {
				var idorganization = req.params.id;
				var partysize = parseInt(req.body['partysize'], 10);
				db.Organization.getRegistrysForPartys(idorganization, function (err, data) {
						if (!err) {							
							//make the partys						
							var partys = utils.makePartys(data, partysize, idorganization);
							//insert the partys into DB
							db.Organization.cleanPartys(idorganization,function(err,data){
								if(!err){
								db.Organization.addPartys(partys, function (err, ok) {
									if (!err) {
										req.flash('success','The Partys were remaded.');			
									} 
									return next(err);
									
									});
								} else {
									return next(err);		
								}
							});
						} else {
							return next(err);
						}
					});
			} else {
				var idstatus = req.params.idstatus;
				idstatus = idstatus > 5 ? 5 : idstatus;
				var idorganization = req.params.id;
				if (idstatus == 3) {
					db.Organization.getRegistrysForPartys(req.params.id, function (err, data) {
						if (!err) {							
							//make the partys						
							var partys = utils.makePartys(data, parseInt(req.body['partysize'], 10), idorganization);
							//insert the partys into DB
							db.Organization.addPartys(partys, function (err, ok) {
								if (!err) {
									//moveStatus
									db.Organization.moveStatusOrganization(req.params.id, idstatus, function (err, ok) {
										if (!err) {
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
	},
		function (req, res, next) {
			res.redirect('/admin/organization/' + req.params.id + '/edit');
		});

	router.get('/configurations', isAdminAuthenticated, function (req, res, next) {
		next();
	}, function (req, res, next) {
		var Response = require('./../response/admin-configurations-response.js');
		res.render('admin-configurations', new Response(req))
	});

	router.get('/configuration/:id/edit', isAdminAuthenticated, function (req, res, next) {
		next();
	}, function (req, res, next) {
		var Response = require('./../response/admin-configuration-edit-response.js');
		res.render('admin-configuration-edit', new Response(req))
	});

	router.get('/configuration/create', isAdminAuthenticated, function (req, res, next) {
		var Response = require('./../response/admin-configuration-create-response.js');
		res.render('admin-configurations-create', new Response(req))
	});



	return router;
}


module.exports = admin; 	

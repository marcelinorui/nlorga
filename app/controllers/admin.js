var express = require('express'),
	db = require('./../db/index.js'),
	utils = require('./../utils/utils.js'),
	account = require('./../models/Account.js'),
	roles = require('./../models/Roles.js'),
	configuration = require('./../models/Configuration.js'),
	participation = require('./../models/Participation.js');



function admin(passport) {
	var router = express.Router();
	//Middleware for admin authentication
	router.use(require('../utils/auth.js').isAdminAuthenticated);

	router.get('/', function (req, res, next) {
		res.render('admin', new (require('./../response/admin-accounts-response.js'))(req));
	});
	
/******************************************************************************************/
/**                                   PARTICIPATION                                      **/
/******************************************************************************************/

	router.get('/participation', participation.search, participation.list, 
	function(req,res,next){
		res.render('participations', new (require('./../response/participations-response.js'))(req))	
	});
	

/******************************************************************************************/
/**                                   ACCOUNTS                                           **/
/******************************************************************************************/
	router.get('/accounts',account.search, account.list, roles.activeRoles,
		function (req, res, next) {
			res.render('admin-accounts', new (require('./../response/admin-accounts-response.js'))(req))
		});
	router.get('/account/:id/edit', account.get,
		function (req, res, next) {
			res.render('admin-account-edit', new (require('./../response/admin-account-edit-response.js'))(req));
		});
	router.post('/account/:id/edit', account.update,
		function (req, res, next) {
			res.redirect('/admin/account/' + req.params.id + '/edit');
		});
	router.get('/account/create', account.create,
		function (req, res, next) {
			res.render('admin-account-create', new (require('./../response/admin-account-create-response.js'))(req));
		});
	router.post('/account/create', account.insert,
		function (req, res, next) {
			res.redirect('/admin/accounts');
		});

/******************************************************************************************/
/**                                   CONFIGURATIONS                                     **/
/******************************************************************************************/
	router.get('/configurations', configuration.list,
		function (req, res) {
			res.render('admin-configurations', new (require('./../response/admin-configurations-response.js'))(req))
		});
	router.get('/configuration/create',
		function (req, res, next) {
			res.render('admin-configuration-create', new (require('./../response/admin-configuration-create-response.js'))(req))
		});
	router.post('/configuration/create', configuration.insert,
		function (req, res, next) {
			res.redirect('/admin/configuration/' + req.session.idconfiguration + '/edit');
		});
	router.get('/configuration/:id/edit', configuration.get,
		function (req, res, next) {
			res.render('admin-configuration-edit', new (require('./../response/admin-configuration-edit-response.js'))(req))
		});
	router.post('/configuration/:id/edit',
		function (req, res, next) {
			res.render('admin-configuration-edit', new (require('./../response/admin-configuration-edit-response.js'))(req));
		});

	return router;
};

module.exports = admin; 	

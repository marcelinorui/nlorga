var express = require('express'),
	organization = require('./../models/Organization.js');

function Commander(passport) {
	var router = express.Router();
	router.use(require('../utils/auth.js').isCommanderAuthenticated);
	
	/******************************************************************************************/
	/**                                   ORGANIZATIONS                                      **/
	/******************************************************************************************/

	router.get('/organizations', organization.list, function (req, res, next) {
		res.render('commander-organizations', new (require('./../response/commander-organizations-response.js'))(req));
	});

	router.get('/organization/create', organization.create, function (req, res, next) {
		res.render('commander-organization-create', new (require('./../response/commander-organization-create-response.js'))(req))
	});

	router.post('/organization/create', organization.insert, function (req, res, next) {
		res.redirect('/commander/organization/' + req.session.idorganization + '/edit');
		req.session.idorganization = null;
	});

	router.get('/organization/:id/edit', organization.get, function (req, res, next) {
		res.render('commander-organization-edit', new (require('./../response/commander-organization-edit-response.js'))(req));
	});

	router.post('/organization/:id/edit', organization.update, function (req, res, next) {
		res.redirect('/commander/organization/' + req.params.id + '/edit');
	});

	router.post('/organization/:id/status/:idstatus', organization.status, function (req, res, next) {
		res.redirect('/commander/organization/' + req.params.id + '/edit');
	});
	return router;
};

module.exports = Commander;
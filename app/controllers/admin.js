var express = require('express'),
	db = require('./../db/index.js'),
	utils = require('./../utils/utils.js'),
	account = require('./../models/Account.js'),
	organization = require('./../models/Organization.js'),
	configuration = require('./../models/Configuration.js');



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

	router.get(organization.listUrl, organization.list, organization.listResponse);
	router.get(organization.createUrl,organization.create,organization.createResponse);
	router.post(organization.insertUrl, organization.insert,organization.insertResponse);  
	router.get(organization.getUrl, organization.get, organization.getResponse);
	router.post(organization.updateUrl,organization.update, organization.updateResponse);
	router.post(organization.statusUrl,organization.status,organization.statusResponse);
	
	router.get(configuration.listUrl, configuration.list, configuration.listResponse);
	router.get(configuration.createUrl,configuration.create,configuration.createResponse);
	router.post(configuration.insertUrl, configuration.insert,configuration.insertResponse);
	router.get(configuration.getUrl, configuration.get, configuration.getResponse);
	router.post(configuration.updateUrl,configuration.update, configuration.updateResponse);

	return router;
};

module.exports = admin; 	

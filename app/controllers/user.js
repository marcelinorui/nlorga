var express = require('express'),
	db = require('./../db/index.js'),
	changepassword = require('./../models/ChangePassword.js'),
	profile = require('./../models/Profile.js');

function user(passport) {
	var router = express.Router();
	router.use(require('../utils/auth.js').isUserAuthenticated);

	router.get('/', function (req, res) {
		res.redirect('/user/index');
	});

	router.get('/index', function (req, res, next) {
		db.Organization.getActiveOrganizations(req.user.idlogin, function (err, organizations) {
			if (!err) {
				req.session.organizations = organizations;
			}
			return next(err);
		});
	}, function (req, res) {
		var Response = require('./../response/user-index-response.js');
		res.render('user-index', new Response(req));
	});

	router.get(changepassword.getUrl,changepassword.get,changepassword.getResponse);
	router.post(changepassword.updateUrl,changepassword.update,changepassword.updateResponse);

	router.get(profile.getUrl,profile.get,profile.getResponse);
	router.post(profile.updateUrl,profile.update,profile.updateResponse);


	router.get('/organization/:id/register', function (req, res, next) {
		db.Organization.getUserOrganizationConfiguration(req.params.id, req.user.idlogin, function (err, userregistry) {
			if (!err) {
				req.session.userregistry = userregistry;
			}
			return next(err);
		});
	}, function (req, res) {
		var Response = require('./../response/user-organization-register-response.js');
		res.render('user-organization-register', new Response(req));
	});

	router.post('/organization/:id/register', function (req, res, next) {
		var profession = req.body['profession'] || -1;
		var havefood = (req.body['havefood'] ? 1 : 0 || 0);
		var havebanner = (req.body['havebanner'] ? 1 : 0 || 0);
		var commander = req.body['commandertag'] || '';

		db.Organization.addOrganizationUser(req.params.id, req.user.idlogin, profession, havefood, havebanner, commander, function (err, ok) {
			if (!err) {
				req.flash('success', 'You are now registed ');
			}
			return next(err);
		});
	}, function (req, res) {
		res.redirect('/user/organization/' + req.params.id + '/view');
	});

	router.get('/organization/:id/view', function (req, res, next) {
		db.Organization.getOrganizationForUser(req.params.id, req.user.idlogin, function (err, data) {
			if (!err) {
				req.session.organization = data;
			}
			return next(err);
		});
	}, function (req, res) {
		var Response = require('./../response/user-organization-view-response.js');
		res.render('user-organization-view', new Response(req));
	});	
	
	return router;
};


module.exports = user; 	

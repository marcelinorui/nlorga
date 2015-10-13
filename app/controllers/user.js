var express = require('express'),
	db = require('./../db/index.js'),
	changepassword = require('./../models/ChangePassword.js'),
	profile = require('./../models/Profile.js'),
	organization = require('./../models/Organization.js');

function user(passport) {
	var router = express.Router();
	router.use(require('../utils/auth.js').isUserAuthenticated);

	router.get('/', function (req, res) {
		res.redirect('/user/index');
	});
	
	/******************************************************************************************/
	/**                                   CHANGE PASSWORD                                    **/
	/******************************************************************************************/
	router.get('/changePassword', function (req, res, next) {
		res.render('user-change-password', new (require('./../response/user-change-password-response.js'))(req));
	});
	
	router.post('/changePassword', changepassword.update, function (req, res, next) {
		res.redirect('/user');
	});

	/******************************************************************************************/
	/**                                    PROFILE                                           **/
	/******************************************************************************************/
	
	router.get('/profile', profile.get, function (req, res, next) {
		res.render('user-profile', new (require('./../response/user-profile-response.js'))(req));
	});
	router.post('/profile', profile.update, function (req, res, next) {
		res.redirect('/user/profile');
	});

	/******************************************************************************************/
	/**                            ORGANIZATIONS IN PROGRESS                                 **/
	/******************************************************************************************/
	
	router.get('/index', organization.userList, function (req, res, next) {
		res.render('user-index', new (require('./../response/user-index-response.js'))(req));
	});

	router.get('/organization/:id/view', organization.view, function (req, res, next) {
		res.render('user-organization-view', new (require('./../response/user-organization-view-response.js'))(req));
	});

	return router;
};
module.exports = user; 	

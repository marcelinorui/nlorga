var express = require('express'),
	db = require('./../models/index.js'),
	async = require('async');

var isUserAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
};

function user(passport) {
	var router = express.Router();

	router.get('/', isUserAuthenticated, function (req, res) {
		var UserIndexResponse = require('./../response/user-index-response.js');
		res.render('user-index', new UserIndexResponse(req, null));
	});

	router.get('/index', isUserAuthenticated, function (req, res) {
		var UserIndexResponse = require('./../response/user-index-response.js');
		res.render('user-index', new UserIndexResponse(req, null));
	});

	router.get('/profile', isUserAuthenticated,
		function (req, res, next) {
			db.User.getUserProfessions(req.user.idlogin, function (err, professions) {
				if (!err) {
					req.session.professions = professions;
				}
				return next(err);
			});
		},
		function (req, res) {
			var UserProfileResponse = require('./../response/user-profile-response.js');
			res.render('user-profile', new UserProfileResponse(req, null));
		});

	router.post('/profile', isUserAuthenticated,
		function (req, res, next) {
			db.Profession.getAllProfessions(function (err, professions) {
				if (err) {
					return next(err);
				}

				var prof = [];
				for (var i = 0; i < professions.length; i++) {
					if (req.body[professions[i].name]) {
						prof.push(professions[i].idprofession);
					}
				}

				var hascommanderTag = req.body['hascommanderTag'] != 'undefined' ? true : false;
				var displayname = req.body['displayname'];

				db.User.changeUserProfile(req.user.idlogin, displayname, hascommanderTag, prof,
					function (err, ok) {
						if (err) {
							return next(err);
						};
						req.user.displayname = displayname;
						req.user.hascommanderTag = hascommanderTag;
						return next();
					});
			});
		},
		function (req, res, next) {
			req.session.message = 'Profile Changed Successfully.';
			res.redirect('/user/profile');
		});

	router.get('/changePassword', isUserAuthenticated, function (req, res) {
		var UserChangePasswordResponse = require('./../response/user-change-password-response.js');
		res.render('user-change-password', new UserChangePasswordResponse(req, null));
	});

	return router;
}


module.exports = user; 	

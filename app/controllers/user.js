var express = require('express'),
	db = require('./../models/index.js');

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
		var Response = require('./../response/user-index-response.js');
		res.render('user-index', new Response(req, null));
	});

	router.get('/index', isUserAuthenticated, function (req, res) {
		var Response = require('./../response/user-index-response.js');
		res.render('user-index', new Response(req, null));
	});

	router.get('/profile', isUserAuthenticated,
		function (req, res, next) {
			db.User.getUserProfile(req.user.idlogin, function (err, profile) {
				if (!err) {
					req.session.profile = profile;
				}
				return next(err);
			});
		},
		function (req, res) {
			var Response = require('./../response/user-profile-response.js');
			res.render('user-profile', new Response(req, null));
		});

	router.post('/profile', isUserAuthenticated,
		function (req, res, next) {
			db.Profession.getAllProfessions(function (err, professions) {
				if (err) {
					return next(err);
				}				
				// Get Selected Professions
				var prof = [];
				for (var i = 0; i < professions.length; i++) {
					if (req.body[professions[i].name]) {
						prof.push(professions[i].idprofession);
					}
				}

				// Get CommanderTag
				var hascommanderTag = false;
				if (req.body['hascommanderTag']) {
					hascommanderTag = true;
				}
				
				// Get DisplayName
				var displayname = req.body['displayname'] ? req.body['displayname'] : '';

				db.User.changeUserProfile(req.user.idlogin, displayname, hascommanderTag, prof,
					function (err, ok) {
						if (err) {
							return next(err);
						};
						req.user.displayname = displayname;
						req.user.hascommanderTag = hascommanderTag;
						req.flash('success', 'Profile Changed Successfully.');
						return next();
					});
			});
		},
		function (req, res, next) {
			res.redirect('/user/profile');
		});

	router.get('/changePassword', isUserAuthenticated,
		function (req, res) {
			var Response = require('./../response/user-change-password-response.js');
			res.render('user-change-password', new Response(req, null));
		});


	router.post('/changePassword', isUserAuthenticated,
		function (req, res, next) {
			if (req.body['password1'] && req.body['password2']) {
				if (req.body['password1'] == req.body['password2']) {
					db.User.changeLoginPassword(req.user.idlogin, req.body['password1'],
						function (err, ok) {
							if (!err) {
								req.flash('success', 'Password changed successfully.');
							}
							return next(err);
						});
				} else {
					req.flash('warning', 'Both fields must have the same password.');
				}
			} else {
				req.flash('warning', 'Both fields must have the same password.');
			}
		},
		function (req, res) {
			res.redirect('/user');
		});

	return router;
}


module.exports = user; 	

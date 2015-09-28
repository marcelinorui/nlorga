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
	router.use(isUserAuthenticated);

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

router.get('/profile',
	function (req, res, next) {
		db.User.getUserProfile(req.user.idlogin, function (err, profile) {
			if (!err) {
				req.session.profile = profile;
			}
			return next(err);
		});
	}, function (req, res) {
		var Response = require('./../response/user-profile-response.js');
		res.render('user-profile', new Response(req));
	});

	router.post('/profile',
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

	}, function (req, res, next) {
		res.redirect('/user/profile');
	});



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

	router.get('/changePassword',
		function (req, res) {
			var Response = require('./../response/user-change-password-response.js');
			res.render('user-change-password', new Response(req));
		});

router.post('/changePassword', function (req, res, next) {
	var obj = {
		password1: req.body['password1'],
		password2: req.body['password2'],
	};

	if (obj.password1 && obj.password2) {
		if (obj.password1 == obj.password2 && obj.password1.legnth > 0 && obj.password2.length > 0) {
			db.User.changeLoginPassword(req.user.idlogin, obj.password1,
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
}, function (req, res) {
	res.redirect('/user');
});

return router;
}


module.exports = user; 	

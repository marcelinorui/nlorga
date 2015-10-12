var db = require('./../db/index.js');

module.exports.getUrl = '/profile';
module.exports.get = function (req, res, next) {
	db.User.getUserProfile(req.user.idlogin, function (err, profile) {
		if (!err) {
			req.session.profile = profile;
		}
		return next(err);
	});
};
module.exports.getResponse = function (req, res, next) {
	var Response = require('./../response/user-profile-response.js');
	res.render('user-profile', new Response(req));
};

module.exports.updateUrl = '/profile';
module.exports.update = function (req, res, next) {
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
};
module.exports.updateResponse = function (req, res, next) {
	res.redirect('/user/profile');
};
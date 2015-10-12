var db = require('./../db/index.js');

module.exports.getUrl = '/changePassword';
module.exports.get = function (req, res, next) {
	next();
};
module.exports.getResponse = function (req, res, next) {
	var Response = require('./../response/user-change-password-response.js');
	res.render('user-change-password', new Response(req));
};

module.exports.updateUrl = '/changePassword';
module.exports.update = function (req, res, next) {
	var obj = {
		password1: req.body['password1'],
		password2: req.body['password2'],
	};

	if (obj.password1 && obj.password2) {
		if (obj.password1 == obj.password2 && obj.password1.length > 0 && obj.password2.length > 0) {
			db.User.changeLoginPassword(req.user.idlogin, obj.password1,
				function (err, ok) {
					if (!err) {
						req.flash('success', 'Password changed successfully.');
					}
					return next(err);
				});
		} else {
			req.flash('warning', 'Both fields must have the same password.');
			return res.redirect('/user/changePassword')
		}
	} else {
		req.flash('warning', 'Both fields must have the same password.');
		return res.redirect('/user/changePassword')
	}
};
module.exports.updateResponse = function (req, res, next) {
	res.redirect('/user');
};
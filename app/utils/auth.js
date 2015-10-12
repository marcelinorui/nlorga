module.exports.isUserAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
};


module.exports.isCommanderAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.idrole >= 2) {
			return next();
		} else {
			res.redirect('/no-permitions');
		}
	}
	else {
		res.redirect('/login');
	}
};

module.exports.isAdminAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.idrole >= 3) {
			return next();
		} else {
			res.redirect('/no-permitions');
		}
	}
	else {
		res.redirect('/login');
	}
};
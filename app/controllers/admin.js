var express = require('express');


function isAdminAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		if (req.user.isAdmin === true) {
			return next();
		} else {
			res.redirect('/no-permitions');
		}
	}
	else {
		res.redirect('/login');
	}
};


function admin(passport) {
	var router = express.Router();

	router.get('/', isAdminAuthenticated, function (req, res, next) {
		res.render('admin', { user: req.user });
	});

	return router;
}


module.exports = admin; 	

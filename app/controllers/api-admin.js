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

function apiAdmin(passport) {
	var router = express.Router();
	
	router.get('/', isAdminAuthenticated, function (req, res) {
		res.status(200).json('ok');
	});
	
	return router;
};

module.exports = apiAdmin;
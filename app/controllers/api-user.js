var express = require('express');

var isUserAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		res.redirect('/login');
	}
};

function api(passport) {
	var router = express.Router();
	
	router.use(isUserAuthenticated);
	
	router.get('/', function (req, res) {
		res.status(200).json('ok');
	});
	
	return router;
};

module.exports = api;
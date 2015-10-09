var express = require('express');

function commander(passport) {
	var router = express.Router();
	router.use(require('../utils/auth.js').isCommanderAuthenticated);
	
	router.get('/', function (req, res) {
		res.redirect('/commander/index');
	});
};

module.exports = commander;
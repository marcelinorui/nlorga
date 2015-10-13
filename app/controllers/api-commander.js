var express = require('express'),
	db = require('./../db/index.js');

function apiCommander(passport) {
	var router = express.Router();

	router.use(require('../utils/auth.js').isCommanderAuthenticated);


	router.get('/organizations', function (req, res, next) {
		db.Organization.listOrganizations('', '', null, req.query['itemsPerPage'], req.query['currentPage'], function (err, organizations) {
			if (!err) {
				res.status(200).json(organizations);
			}
			return next(err);
		});
	});

	return router;
};

module.exports = apiCommander;
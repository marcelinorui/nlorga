var express = require('express'),
		 db = require('./../models/index.js');
		 
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
	
	router.use(isAdminAuthenticated);
	
	router.get('/', function (req, res) {
		res.status(200).json('ok');
	});
		
	router.get('/accounts', function(req,res,next){
		db.Account.listAccounts('','',null,req.query['itemsPerPage'],req.query['currentPage'],function(err, accounts){
			if(!err){
				res.status(200).json(accounts);
			} else {
				return next(err);
			}
		});
	});
	
	router.get('/organizations', function(req,res,next){
	db.Organization.listOrganizations('','',null,req.query['itemsPerPage'],req.query['currentPage'],function(err, organizations){
			if(!err){
				res.status(200).json(organizations);
			}
			return next(err);
		});
	});
	
	router.get('/configurations', function(req,res,next){
	db.Configuration.listConfigurations('','',null,req.query['itemsPerPage'],req.query['currentPage'],function(err, organizations){
			if(!err){
				res.status(200).json(organizations);
			}
			return next(err);
		});
	});	
	
		
	
	
	return router;
};

module.exports = apiAdmin;
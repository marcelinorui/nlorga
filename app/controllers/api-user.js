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

function api(passport) {
	var router = express.Router();
	
	router.use(isUserAuthenticated);
	
	router.get('/', function (req, res) {
		res.status(200).json('ok');
	});
	
	router.get('/organizations', function (req, res) {
		db.Organization.getActiveOrganizations(req.user.idlogin,function(err,organizations){
			if(!err){
				return res.status(200).json(organizations);
			}
			return res.status(500).json('error');
		});			
	});
	
	router.get('/organization/:id/status',function(req,res){
		db.Organization.getOrganizationStatus(req.params.id,function(err,status){
			if(!err){
				return res.status(200).json(status);
			}
			return res.status(500).json('error');
		})
	});
	
	router.get('/organization/:id/registrys',function(req,res){
		db.Organization.getRegistrys(req.params.id,function(err,registrys){
			if(!err){
				return res.status(200).json(registrys);
			}
			return res.status(500).json('error');
		})
	});
	
	
	router.get('/organization/:id/partys',function(req,res){
		db.Organization.getPartys(req.params.id,function(err,registrys){
			if(!err){
				return res.status(200).json(registrys);
			}
			return res.status(500).json('error');
		})
	});
	
	
	router.put('/organization/:id/registry',function(req,res){
		var idorganization = req.params.id;
		var idlogin = req.user.idlogin;
		var idprofession = req.body['idprofession'] || 0;
		var havefood = req.body['havefood'] || 0;
		var havebanner = req.body['havebanner'] || 0;
		var havetag = req.body['havetag'] || '';
		db.Organization.addOrganizationUser(idorganization, idlogin, idprofession, havefood, havebanner, havetag ,function(err,ok){
			if(!err){
				return res.status(200).json(ok);
			}
			return res.status(500).json('error');
		});
	});
	
	router.post('/organization/:id/registry',function(req,res){
		var idorganization =req.params.id;
		var idlogin = req.user.idlogin;
		var idprofession = req.body['idprofession'];
		var havefood = req.body['havefood'];
		var havebanner = req.body['havebanner'];
		var havetag = req.body['havetag'];
		db.Organization.addOrganizationUser(idorganization, idlogin, idprofession, havefood, havebanner, havetag ,function(err,ok){
			if(!err){
				return res.status(200).json(ok);
			}
			return res.status(500).json('error');
		});
	});
	return router;
};

module.exports = api;
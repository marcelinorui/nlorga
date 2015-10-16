var express = require('express'),
		account = require('./../models/Account.js'),
		 db = require('./../db/index.js');
		 
function apiAdmin(passport) {
	var router = express.Router();
	
	router.use(require('../utils/auth.js').isAdminAuthenticated);
	
	router.get('/', function (req, res) {
		res.status(200).json('ok');
	});
		
	router.get('/accounts', account.search, function(req,res,next){
		db.Account.listAccounts(req.session.sqlsearch,'',null,req.query['itemsPerPage'],req.query['currentPage'],function(err, accounts){
			if(!err){
				res.status(200).json(accounts);
			} else {
				return next(err);
			}
		});
	});	
	
	router.get('/configurations', function(req,res,next){
		db.Configuration.listConfigurations('','',null,req.query['itemsPerPage'],req.query['currentPage'],function(err, configurations){
			if(!err){
				res.status(200).json(configurations);
			}
			return next(err);
		});
	});	
	
	router.put('/configuration/:id',function(req,res,next){
		var id = Number(req.params.id);
		var description = req.body['description'];
		var jsviewname = req.body['jsviewname'];
		var pickfood = req.body['pickfood'] == true ? 1 : 0;
		var pickbanner = req.body['pickbanner'] == true ? 1 : 0;
		var pickcommander = req.body['pickcommander'] == true ? 1 : 0;
		db.Configuration.saveConfiguration(id,description,jsviewname,pickbanner,pickfood,pickcommander,function(err,ok){
			if(!err){
				res.status(200).json(ok);
			} else {
				return next(err);
			}
		});
	});	
	
	router.put('/configuration/profession/:id',function(req,res,next){
		var id = Number(req.params.id);
		var rank = Number(req.body['rank']);
		db.Configuration.saveConfigurationProfession(id,rank,function(err,ok){
			if(!err){
				res.status(200).json(ok);
			} else {
				return next(err);
			}
		});
	});	
	
	return router;
};

module.exports = apiAdmin;
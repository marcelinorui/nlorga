var express = require('express'),
	db = require('./../models/index.js'),
	utils = require('./../utils/utils.js');


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
		var Response = require('./../response/admin-accounts-response.js');
		res.render('admin', new Response(req,null));
	});	
	
	router.get('/organizations', isAdminAuthenticated, function(req,res,next){
		next();
	},function(req,res,next){
		var Response = require('./../response/admin-organizations-response.js');
		res.render('admin-organizations',new Response(req,null))
	});
	
	router.get('/organization/:id/edit', isAdminAuthenticated, function(req,res,next){
		var Response = require('./../response/admin-organization-edit-response.js');
		res.render('admin-organization-edit',new Response(req,null))
	});
	
	router.get('/organization/create', isAdminAuthenticated, function(req,res,next){
		var Response = require('./../response/admin-organizations-create-response.js');
		res.render('admin-organization-create',new Response(req,null))
	});
	
	router.get('/configurations', isAdminAuthenticated, function(req,res,next){
		next();
	},function(req,res,next){
		var Response = require('./../response/admin-configurations-response.js');
		res.render('admin-configurations',new Response(req,null))
	});
	
	router.get('/configuration/:id/edit', isAdminAuthenticated, function(req,res,next){
		next();
		},function(req,res,next){
		var Response = require('./../response/admin-configuration-edit-response.js');
		res.render('admin-configuration-edit',new Response(req,null))
	});
	
	router.get('/configuration/create', isAdminAuthenticated, function(req,res,next){
		var Response = require('./../response/admin-configuration-create-response.js');
		res.render('admin-configurations-create',new Response(req,null))
	});
	
	router.get('/accounts', isAdminAuthenticated, function(req,res,next){
		db.Account.listAccounts('','',null,null,null,function(err, accounts){
			if(!err){
				req.session.accounts = accounts;
			}
			return next(err);
		});
	},function(req,res){
		var Response = require('./../response/admin-accounts-response.js');
		res.render('admin-accounts', new Response(req, null))
	});
	
	router.get('/account/:id/edit', isAdminAuthenticated, function(req,res,next){
		db.Account.getAccount(req.params.id, function(err, account){
			if(!err){
				req.session.account = account;				
			}
			return next(err);
		})
	},function(req,res,next){
		var Response = require('./../response/admin-account-edit-response.js');
		res.render('admin-account-edit',new Response(req,null));
	});
	
	router.post('/account/:id/edit', isAdminAuthenticated, function(req,res,next){		
		var account = {
			idlogin:req.params.id,
			username: req.body.username,
			displayname: req.body['displayname'] ? req.body.displayname : '',
			hascommanderTag: req.body['hascommanderTag'] ? 1:0,
			isAdmin : req.body['isAdmin'] ? 1:0,
			forDelete : req.body['forDelete'] ? 1:0		
		};		
		db.Account.updateAccount(
			account.idlogin,
			account.username,
			account.displayname,
			account.hascommanderTag,
			account.isAdmin,
			account.forDelete, 
		function(err, ok){
			if(!err){
					req.flash('success','Account changed successfully.');	
			}
			return next(err);
		})
	},function(req,res,next){
		res.redirect('/admin/account/'+req.params.id+'/edit');
	});
	
	router.get('/account/create', isAdminAuthenticated, function(req,res,next){
		var Response = require('./../response/admin-account-create-response.js');
		res.render('admin-account-create',new Response(req,null));
	});
	
	router.post('/account/create', isAdminAuthenticated, function(req,res,next){
		var code = utils.createHashAndSalt(req.body.password);		
		var account = {
			username: req.body.username,
			password: code.hash.toString('utf8'),
			displayname: req.body['displayname'] ? req.body.displayname : '',
			salt : code.salt.toString('utf8'),
			hascommanderTag: req.body['hascommanderTag'] ? 1:0,
			isAdmin : req.body['isAdmin'] ? 1:0			
		};		
		db.Account.createAccount(
			account.username,
			account.password,
			account.displayname,
			account.salt,
			account.hascommanderTag,
			account.isAdmin		
			,function(err,ok){
				if(!err){
					req.flash('success','A new account was created successfully.');
				}
				next(err);
			});		
	},function(req,res){
		res.redirect('/admin/accounts');
	});

	return router;
}


module.exports = admin; 	

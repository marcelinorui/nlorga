var express = require('express');

function base(passport) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		var BaseResponse = require('./../response/base-response.js');
		res.render('index', new BaseResponse(req,null));
	});

	router.get('/index', function (req, res, next) {
		var BaseResponse = require('./../response/base-response.js');
		res.render('index', new BaseResponse(req,null));
	});

	router.get('/login', function (req, res, next) {
		var LogInResponse = require('./../response/login-response.js');
		res.render('login', new LogInResponse(req, null));
	});

	router.post('/login', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if(err){
				req.flash('error', err);
				return res.redirect('/login');
			}
			if (!user) {
				req.flash('warning', info.message);
				return res.redirect('/login');
			}
			req.login(user, { session: true }, function (err) {
				if (err) { return next(err) }
				return res.redirect('/user/');
			});
		})(req, res, next)
	});

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
	
	router.get('/no-permitions', function (req, res) {
		var BaseResponse = require('./../response/base-response.js');
		res.render('no-permitions', new BaseResponse(req,null));
	});
	
	return router;
}


module.exports = base; 	

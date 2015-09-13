var express = require('express');

function base(passport) {
	var router = express.Router();

	router.get('/', function (req, res, next) {
		var Response = require('./../response/base-response.js');
		res.render('index', new Response(req));
	});

	router.get('/index', function (req, res, next) {
		var Response = require('./../response/base-response.js');
		res.render('index', new Response(req));
	});

	router.get('/login', function (req, res, next) {
		var Response = require('./../response/login-response.js');
		res.render('login', new Response(req));
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
		var Response = require('./../response/base-response.js');
		res.render('no-permitions', new Response(req));
	});
	
	return router;
}


module.exports = base; 	

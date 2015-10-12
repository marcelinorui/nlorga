var db = require('./../db/index.js'),
	utils = require('./../utils/utils.js');
	
module.exports.listUrl = '/accounts';
module.exports.list = function (req, res, next) {
	db.Account.listAccounts('', '', null, null, null, function (err, accounts) {
		if (!err) {
			req.session.accounts = accounts;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};
module.exports.listResponse = function (req, res, next) {
	var Response = require('./../response/admin-accounts-response.js');
	res.render('admin-accounts', new Response(req))
};

module.exports.getUrl = '/account/:id/edit';
module.exports.get = function (req, res, next) {
	db.Account.getAccount(req.params.id, function (err, account) {
		if (!err) {
			req.session.account = account;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};
module.exports.getResponse = function (req, res, next) {
	var Response = require('./../response/admin-account-edit-response.js');
	res.render('admin-account-edit', new Response(req));
};

module.exports.updateUrl = '/account/:id/edit';
module.exports.update = function (req, res, next) {
	var account = {
		idlogin: req.params.id,
		username: req.body.username,
		displayname: req.body['displayname'] ? req.body.displayname : '',
		hascommanderTag: req.body['hascommanderTag'] ? 1 : 0,
		isAdmin: req.body['isAdmin'] ? 1 : 0,
		forDelete: req.body['forDelete'] ? 1 : 0
	};

	db.Account.updateAccount(
		account.idlogin,
		account.username,
		account.displayname,
		account.hascommanderTag,
		account.isAdmin,
		account.forDelete,
		function (err, ok) {
			if (!err) {
				req.flash('success', 'Account changed successfully.');
			} else {
				req.flash('error', 'SQL Error.')
			}
			return next(err);
		});
};
module.exports.updateResponse = function (req, res, next) {
	res.redirect('/admin/account/' + req.params.id + '/edit');
};

module.exports.createUrl = '/account/create'
module.exports.create = function (req, res, next) {
	next();
};
module.exports.createResponse = function (req, res, next) {
	var Response = require('./../response/admin-account-create-response.js');
	res.render('admin-account-create', new Response(req));
};

module.exports.insertUrl = '/account/create';
module.exports.insert = function (req, res, next) {
		var code = utils.createHashAndSalt(req.body.password);
		var account = {
			username: req.body.username,
			password: req.body.password,
			displayname: req.body['displayname'] ? req.body.displayname : '',
			salt: code.salt.toString('hex'),
			hascommanderTag: req.body['hascommanderTag'] ? 1 : 0,
			isAdmin: req.body['isAdmin'] ? 1 : 0
		};

		db.Account.createAccount(
			account.username,
			account.password,
			account.displayname,
			account.salt,
			account.hascommanderTag,
			account.isAdmin
			, function (err, ok) {
				if (!err) {
					req.flash('success', 'A new account was created successfully.');
				}
				next(err);
			});
};

module.exports.insertResponse = function(req,res,next){
	res.redirect('/admin/accounts');
};
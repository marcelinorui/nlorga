var db = require('./../db/index.js'),
	utils = require('./../utils/utils.js');

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

module.exports.get = function (req, res, next) {
	db.Account.getAccount(req.params.id, function (err, account) {
		if (!err) {
			db.Roles.getRoles(function (err, roles) {
				if (!err) {
					req.session.roles = roles;
					req.session.account = account;
				} else {
					req.flash('error', 'SQL Error');
				}
				return next(err);
			});
		} else {
			req.flash('error', 'SQL Error');
			return next(err);
		}
	});
};

module.exports.update = function (req, res, next) {
	var account = {
		idlogin: req.params.id,
		username: req.body.username,
		displayname: req.body['displayname'] ? req.body.displayname : '',
		hascommanderTag: req.body['hascommanderTag'] ? 1 : 0,
		idrole: Number(req.body['idrole']),
		forDelete: req.body['forDelete'] ? 1 : 0
	};

	db.Account.updateAccount(
		account.idlogin,
		account.username,
		account.displayname,
		account.hascommanderTag,
		account.idrole,
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

module.exports.create = function (req, res, next) {
	db.Roles.getRoles(function (err, roles) {
		if (!err) {
			req.session.roles = roles;
		}
		return next(err);
	});
};

module.exports.insert = function (req, res, next) {
	var code = utils.createHashAndSalt(req.body.password);
	var account = {
		username: req.body.username,
		password: req.body.password,
		displayname: req.body['displayname'] ? req.body.displayname : '',
		salt: code.salt.toString('hex'),
		hascommanderTag: req.body['hascommanderTag'] ? 1 : 0,
		idrole: Number(req.body['idrole'])
	};

	db.Account.createAccount(
		account.username,
		account.password,
		account.displayname,
		account.salt,
		account.hascommanderTag,
		account.idrole
		, function (err, ok) {
			if (!err) {
				req.flash('success', 'A new account was created successfully.');
			}
			next(err);
		});
};

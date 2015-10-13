var db = require('./../db/index.js'),
	utils = require('./../utils/utils.js');

module.exports.list = function (req, res, next) {
	db.Configuration.listConfigurations('', '', null, null, null, function (err, configurations) {
		if (!err) {
			req.session.configurations = configurations;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};

module.exports.insert = function (req, res, next) {
	db.Configuration.getConfiguration(req.params.id, function (err, configuration) {
		if (!err) {
			req.session.configuration = configuration;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};

module.exports.get = function (req, res, next) {
	db.Configuration.getConfiguration(req.params.id, function (err, configuration) {
		if (!err) {
			req.session.configuration = configuration;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};

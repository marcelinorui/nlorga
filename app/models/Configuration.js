var db = require('./../db/index.js'),
	utils = require('./../utils/utils.js');

module.exports.listUrl = '/configurations';
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
module.exports.listResponse = function (req, res) {
	var Response = require('./../response/admin-configurations-response.js');
	res.render('admin-configurations', new Response(req))
};



module.exports.createUrl = '/configuration/create';
module.exports.create = function (req, res, next) {
	next();
};
module.exports.createResponse = function (req, res, next) {
	var Response = require('./../response/admin-configuration-create-response.js');
	res.render('admin-configuration-create', new Response(req))
};

module.exports.insertUrl = '/configuration/create';
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
module.exports.insertResponse = function (req, res, next) {
	res.redirect('/admin/configuration/' + req.session.idconfiguration + '/edit');
};



module.exports.getUrl = '/configuration/:id/edit';
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
module.exports.getResponse = function (req, res, next) {
	var Response = require('./../response/admin-configuration-edit-response.js');
	res.render('admin-configuration-edit', new Response(req))
};


module.exports.updateUrl = '/configuration/:id/edit';
module.exports.update = function (req, res, next) {
	next();
};
module.exports.updateResponse = function (req, res, next) {
	var Response = require('./../response/admin-configuration-edit-response.js');
	res.render('admin-configuration-edit', new Response(req));
};
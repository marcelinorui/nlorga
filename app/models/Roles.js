var db = require('./../db/index.js');
	
module.exports.activeRoles = function (req, res, next) {
	db.Roles.getRoles(function (err, roles) {
		if (!err) {
			req.session.roles = roles;
		} else {
			req.flash('error', 'SQL Error');
		}
		return next(err);
	});

};

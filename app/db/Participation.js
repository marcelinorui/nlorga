
var util = require('util'),
    mysql = require('mysql'),
    Base = require('./../sql/base.js');

function Participation(db) {
	Base.apply(this, arguments);
};

util.inherits(Participation, Base);

Participation.prototype.getParticipation = function (startdate,enddate, callback) {
	var sql = 'CALL getparticipation(?,?)';
	var params = [startdate,enddate];
	var query = mysql.format(sql, params);
	var self = this;
	this.db.query(query, function (err, rows, fields) {
		if (!err) {
			var participations = self.getTable(rows, fields,0);
			callback(err, participations);
		} else {
			callback(err, null);
		}
	});
};
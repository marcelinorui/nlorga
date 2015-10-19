var db = require('./../db/index.js');

module.exports.search = function(req,res,next){
	var search = {startdate:'',enddate:''};
	if(req.query['startdate']){
		if(req.query['startdate'] !== ""){
			search.startdate = req.query['startdate'];
		}
	}
	
	if(req.query['enddate']){
		if(req.query['enddate'] !== ""){
			search.enddate = req.query['enddate'];
		}
	}
	
	req.session.search = search;
	return next();	
};


module.exports.list = function (req, res, next) {
	db.Participation.getParticipation(req.session.search.startdate,req.session.search.enddate, function (err, participations) {
		if (!err) {
			req.session.participations = participations;
		} else {
			req.flash('error', 'SQL Error.')
		}
		return next(err);
	});
};
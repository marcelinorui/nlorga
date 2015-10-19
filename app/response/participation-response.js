var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this,arguments);
	this.participations = request.session.participations || null;
	this.search = request.session.search || { startdate:'', enddate:''};
	
	if ( request.session.participations ){
		request.session.participations = null;
	}
	if ( request.session.search ){
		request.session.search = null;
	}
}
util.inherits(Response, BaseResponse);

module.exports = Response;
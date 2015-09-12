var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this,arguments);
	
	this.profile = request.session.profile || null;	
	if ( request.session.profile ){
		request.session.profile = null;
	}
}
util.inherits(Response, BaseResponse);

module.exports = Response;
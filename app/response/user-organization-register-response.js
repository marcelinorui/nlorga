var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this,arguments);
	
	this.userregistry = request.session.userregistry || null;	
	if ( request.session.userregistry ){
		request.session.userregistry = null;
	}
}
util.inherits(Response, BaseResponse);

module.exports = Response;
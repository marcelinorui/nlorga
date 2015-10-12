var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	this.roles = request.session.roles || null;	
	if ( request.session.roles ){
		request.session.roles = null;
	}
}
util.inherits(Response, BaseResponse);

module.exports = Response;
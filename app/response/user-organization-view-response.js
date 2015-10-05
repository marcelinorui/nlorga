var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	this.organization = request.session.organization.organization || {};	
	this.options = request.session.organization.options || {};
	if ( request.session.organization ){
		request.session.organization = null;
	}	
}

util.inherits(Response, BaseResponse);

module.exports = Response;
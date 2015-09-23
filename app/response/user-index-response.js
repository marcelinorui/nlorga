var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this,arguments);
	this.organizations = request.session.organizations || [];
	if ( request.session.organizations ){
		request.session.organizations = null;
	}	
}
util.inherits(Response, BaseResponse);

module.exports = Response;
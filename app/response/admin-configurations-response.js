var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	this.configurations = request.session.configurations || null;	
	if ( request.session.configurations ){
		request.session.configurations = null;
	}
}
util.inherits(Response, BaseResponse);

module.exports = Response;
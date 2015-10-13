var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	
	this.partyconfiguration = request.session.partyconfiguration;
	if ( request.session.partyconfiguration ){
		request.session.partyconfiguration = null;
	}
}
util.inherits(Response, BaseResponse);

module.exports = Response;
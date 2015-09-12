var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	this.configuration = request.session.configuration || null;	
	if ( request.session.configuration ){
		request.session.configuration = null;
	}	
}

util.inherits(Response, BaseResponse);

module.exports = Response;
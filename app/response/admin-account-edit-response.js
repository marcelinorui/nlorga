var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(requests){
	BaseResponse.apply(this, arguments);
	this.account = request.session.account || null;	
	if ( request.session.account ){
		request.session.account = null;
	}	
}

util.inherits(Response, BaseResponse);

module.exports = Response;
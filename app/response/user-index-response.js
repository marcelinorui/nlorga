var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this,arguments);
	this.organizationInProgress = false;
}
util.inherits(Response, BaseResponse);

module.exports = Response;
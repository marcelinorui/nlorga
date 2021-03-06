var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request, error){
	BaseResponse.apply(this,arguments);
	this.error = error || null;
}
util.inherits(Response, BaseResponse);

module.exports = Response;
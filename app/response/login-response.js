var BaseResponse = require('./base-response.js'),
	util = require('util');

function LogInResponse(request, error){
	BaseResponse.apply(this,arguments);
}
util.inherits(LogInResponse, BaseResponse);



module.exports = LogInResponse;
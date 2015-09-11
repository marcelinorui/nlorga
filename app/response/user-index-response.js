var BaseResponse = require('./base-response.js'),
	util = require('util');

function UserIndexResponse(request, error){
	BaseResponse.apply(this,arguments);
	this.organizationInProgress = false;
}
util.inherits(UserIndexResponse, BaseResponse);



module.exports = UserIndexResponse;
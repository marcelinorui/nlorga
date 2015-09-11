var BaseResponse = require('./base-response.js'),
	util = require('util');

function UserChangePasswordResponse(request, error){
	BaseResponse.apply(this,arguments);
}
util.inherits(UserChangePasswordResponse, BaseResponse);



module.exports = UserChangePasswordResponse;
var BaseResponse = require('./base-response.js'),
	util = require('util');

function UserProfileResponse(request, error){
	BaseResponse.apply(this,arguments);
	this.professions = request.session.professions || null;
	if ( request.session.professions ){
		request.session.professions = null;
	}
}
util.inherits(UserProfileResponse, BaseResponse);

module.exports = UserProfileResponse;
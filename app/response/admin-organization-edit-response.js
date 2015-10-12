var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	this.organization = request.session.organization.organization || {};
	this.partyconfiguration = request.session.organization.partyconfiguration || {};	
	this.useroptions = 	request.session.organization.options || {};
	this.partysize = request.session.partysize || null;
	if ( request.session.organization ){
		request.session.organization = null;
	}	
}

util.inherits(Response, BaseResponse);

module.exports = Response;
var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	this.organization = request.session.organization.organization || null;	
	this.partyconfiguration = request.session.organization.partyconfiguration || null;
	this.registrys = request.session.organization.registrys ||  null;
	this.partys = request.session.organization.partys ||  null;
	if ( request.session.organization ){
		request.session.organization = null;
	}	
}

util.inherits(Response, BaseResponse);

module.exports = Response;
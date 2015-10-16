var BaseResponse = require('./base-response.js'),
	util = require('util');

function Response(request){
	BaseResponse.apply(this, arguments);
	this.accounts = request.session.accounts || null;
	this.search = request.session.search || {name:'', idrole:'', removed:'', haveTag:''};
	this.roles = request.session.roles || [];	
	if ( request.session.accounts ){
		request.session.accounts = null;
	}
}
util.inherits(Response, BaseResponse);

module.exports = Response;
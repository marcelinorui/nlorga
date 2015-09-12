function BaseResponse(request, error){
	this.error = error || null;
	this.messages = request.session.flash || {};
	this.user = request.user || null;
	
	request.session.flash = {};	
}

module.exports = BaseResponse;
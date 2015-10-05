function BaseResponse(request){
	this.messages = request.session.flash || {};
	this.user = request.user || null;
	request.session.flash = {};	
}

module.exports = BaseResponse;
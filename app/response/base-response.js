function BaseResponse(request){
	this.messages = request.session.flash || {};
	this.user = request.user || null;
	this.pagetitle = request.pagetitle;
	request.session.flash = {};	
}

module.exports = BaseResponse;
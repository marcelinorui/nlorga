function BaseResponse(request, error){
	this.error = error || null;
	this.message = request.session.message || null;
	this.user = request.user || null;
	
	if ( request.session.message ){
		request.session.message = '';
	}
}

module.exports = BaseResponse;
NL.Collection.UserIndex = NL.Collection.UserIndex || Backbone.Collection.extend({
	model: NL.Model.UserIndex,
	initialize:function(){
		this.url ='/api/user/organizations';
	},
	parse:function(response){
		this.trigger('collection:data-fetched', response);
		return response;
	}		
}); 
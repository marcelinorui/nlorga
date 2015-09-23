NL.Model.UserIndex = NL.Model.UserIndex || Backbone.Model.extend({
	url: function(){ return '/api/user/organization'; },
	idAttribute: 'idorganization'
}); 
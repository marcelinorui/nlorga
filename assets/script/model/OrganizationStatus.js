NL.Model.OrganizationStatus = NL.Model.OrganizationStatus || Backbone.Model.extend({
		idAttribute:'idorganization',
		defaults:{
			idorganization:-1,
			idstatus: -1
		},
		url:function(){
			return '/api/user/organization/'+this.get('idorganization')+'/status';
		}
	});
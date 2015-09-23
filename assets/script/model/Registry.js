NL.Model.Registry = NL.Model.Registry || Backbone.Model.extend({
	defaults:{
		idorganization:-1,
		idregistry:null,
		idprofession:null,
		havebanner:false,
		havefood:false,
		havetag:'',
		name:''
	},
	idAttribute:'idregistry',
	url:function(){return '/api/user/organization/'+this.get('idorganization')+'/registry';}
});
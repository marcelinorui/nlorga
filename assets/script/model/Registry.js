NL.Model.Registry = NL.Model.Registry || Backbone.Model.extend({
	defaults:{
		idregistry:null,
		idprofession:null,
		havebanner:false,
		havefood:false,
		haveTag:'',
		name:''
	},
	idAttribute:'idregistry',
	url:'/api/user/registry'
});
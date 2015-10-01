NL.Model.PartyConfiguration = NL.Model.PartyConfiguration || Backbone.Model.extend({
	idAttribute:'idpartyconfiguration',
	defaults: function () {
		return {
			idpartyconfiguration: -1,
			description: '', 
			jsviewname: '',
			pickfood: false,  
			pickbanner: false, 
			pickcommander: false,
			createddate:'' ,
			updateddate:'' ,
			enddate:'',
			profession: new NL.Collection.PartyConfigurationProfession()			
		};
	},
	url: function(){
		return '/api/admin/configuration/'+this.get('idpartyconfiguration');
	}
});
NL.Model.PartyConfigurationProfession = NL.Model.PartyConfigurationProfession || Backbone.Model.extend({
	idAttribute: 'idpartyconfigurationprofession',
	defaults: {
		idpartyconfigurationprofession: -1,
		idpartyconfiguration: -1,
		idprofession: -1,
		rank: -1,
		makeExtraGroup: false,
		groupName: '',
		createddate: '',
		updateddate: ''
	},
	url: function () {
		return '/api/admin/configuration/profession/' + this.get('idpartyconfigurationprofession');
	}
});
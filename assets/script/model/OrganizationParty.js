NL.Model.OrganizationParty = NL.Model.OrganizationParty || Backbone.Model.extend({
	defaults: function () {
		return {
			partyname: '',
			members: new NL.Collection.OrganizationPartyMember(),
			jobs: null
		};
	}
});
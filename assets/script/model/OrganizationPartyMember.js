NL.Model.OrganizationPartyMember = NL.Model.OrganizationPartyMember || Backbone.Model.extend({
	defaults: {
		partyname: '',
		username: '',
		displayname: '',
		profession: '',
		havebanner: false,
		havefood: false,
		haveTag: ''
	}
});
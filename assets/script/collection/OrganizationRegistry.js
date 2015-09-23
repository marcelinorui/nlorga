NL.Collection.OrganizationRegistry = NL.Collection.OrganizationRegistry || Backbone.Collection.extend({
	defaults: {
		idorganization: -1,
		statistic: []
	},
	model: NL.Model.OrganizationRegistry,
	url: function () {
		return '/api/user/organization/' + this.options.idorganization + '/registrys';
	},
	initialize: function (models, options) {
		this.options = _.extend(this.defaults, options);
		this.options.statistic = _.sortBy(_.map(_.countBy(models, 'profession'), function (count, key) { return { name: key, value: count }; }), 'name');
	},
	parse: function (response) {
		this.options.statistic = _.sortBy(_.map(_.countBy(response, 'profession'), function (count, key) { return { name: key, value: count }; }), 'name');
		console.log('.');
		return response;
	}
});
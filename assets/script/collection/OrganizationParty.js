NL.Collection.OrganizationParty = NL.Collection.OrganizationParty || Backbone.Collection.extend({
	model: NL.Model.OrganizationParty,
	url: function () {
		return '/api/user/organization/' + this.options.idorganization + '/partys';
	},
	defaults: {
		idorganization: -1,
	},
	initialize: function (models,options) {
		this.options = _.extend(this.defaults, options);
	},
	setJobs:function(arr){
		return arr;
	},
	getMembers:function(){
		return _.flatten(_.pluck( this.toJSON(),'members'));
	},
	getStatistics:function(){
		return _.sortBy(
					_.map(
						_.countBy(this.getMembers(), 'profession'), function (count, key) { 
							return { name: key, value: count }; }), 'name');
	},
	getFood:function(){
		var member = _.findWhere(this.getMembers(),{havefood:true});
		if (member) {
			return member.username;
		}
		return null;
	},
	getBanner:function(){
		var member = _.findWhere(this.getMembers(),{havebanner:true});
		if (member) {
			return member.username;
		}
		return null;
	}
});
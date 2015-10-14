NL.Collection.OrganizationParty = NL.Collection.OrganizationParty || Backbone.Collection.extend({
	model: NL.Model.OrganizationParty,
	url: function () {
		return '/api/user/organization/' + this.options.idorganization + '/partys';
	},
	defaults: {
		idorganization: -1,
		username:''
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
	getStatistic:function(){
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
	},
	getMyParty:function(){
		var username = this.options.username;
		var partys = _.select(this.toJSON(),function(p){ 
			var myparty = _.select(p.members,function(m){ 
				return m.username == username;
			}); 
			if(myparty.length > 0){ return myparty; }
		});
		if(partys && partys.length > 0){
			return partys[0].partyname;
		}
		return "";
	}
});
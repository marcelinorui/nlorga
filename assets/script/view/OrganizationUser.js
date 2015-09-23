NL.View.UserOrganization = NL.View.UserOrganization || Backbone.View.extend({
	template: NL.Template['user-organization'],
	initialize: function () {
		this.cached = {
			view : {
				user:undefined,
				statistic:undefined,
				registry:undefined,
				party:undefined
			},
			model:{
				user:undefined,
				statistic:undefined,
				registry:undefined,
				party:undefined
			}			
		};
		this.render();
		
	},
	render: function () {
		this.$el.html(this.template());

		this.renderSubViews();
		return this;
	},
	renderSubViews: function () {
		var idstatus = this.model.get('organization').idstatus;
		
		this.cached.userview = this.cached.userview|| new NL.View.OrganizationUserRegistry({
			el: '.user-data',
			model: new Backbone.Model(this.model.get('options'))
		});
		this.cached.userview.on('userregistry:save', this.saveuserdata, this);

		if (idstatus == 2 || idstatus == 3 || idstatus == 4) {
			this.cached.statisticview = this.cached.statisticview || new NL.View.OrganizationStatistic({
				el: '.statistic-data',
				collection: new Backbone.Collection(this.model.get('statistic'))
			});
			this.cached.registryview = this.cached.registryview || new NL.View.OrganizationRegistry({
				el: '.registry-data',
				collection: new Backbone.Collection(this.model.get('registry'))
			});
		}

		if (idstatus == 5 || idstatus == 6) {			
			this.cached.statisticview = this.cached.statisticview || new NL.View.OrganizationStatistic({
				el: '.statistic-data',
				collection: new Backbone.Collection(this.model.get('statistic'))
			});
			
			this.OrganizationPartyView =  this.OrganizationPartyView || new NL.View.OrganizationParty({
				el: '.party-data',
				jsviewname: this.model.get('organization').jsviewname,
				collection: new Backbone.Collection(this.model.get('partys'))
			});
		}
	},
	saveuserdata: function (userinput) {
		console.log(JSON.stringify(userinput));
	}
});
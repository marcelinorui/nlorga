NL.View.OrganizationParty = NL.View.OrganizationParty || Backbone.View.extend({
	statisticTemplate: NL.Template["organization-statistic"],
	template: NL.Template["organization-party"],
	defaults: {
		timeOutHandler: -1,
		idorganization: -1,
		jsviewname: '',
		partys: []
	},
	initialize: function (options) {
		this.options = _.extend(this.defaults, options);
		var PartyCollection = NL.Collection[this.options.jsviewname];
		this.collection = new PartyCollection(
			this.defaults.partys,
			{
				idorganization: this.options.idorganization
			});
		this.collection.on('reset', this.render, this);
		if(this.collection.length === 0){
			this.collection.fetch({reset:true});
		}
		this.render();
		this.startTimer();
	},	
	render: function () {
		this.$el.html('');
		this.$el.append(this.statisticTemplate(this.collection.getStatistic()));
		this.$el.append(NL.Template['organization-foodbanner']({
				bannerusername: this.collection.getBanner(),
				foodusername:this.collection.getFood()
			}
		));
		this.$el.append(this.template(this.collection.toJSON()));
		if ( this.options.jsviewname ){
			this.$el.append(NL.Template[this.options.jsviewname](this.collection.toJSON()));
		}
	},
	startTimer: function () {
		var self = this;
		if (this.options.timeOutHandler < 0) {
			this.options.timeOutHandler = setInterval(function () {
				self.collection.fetch({ reset: true });
			}, 10000);
		}
	},
	stopTimer: function () {
		clearInterval(this.options.timeOutHandler);
		this.options.timeOutHandler = -1;
	},
});
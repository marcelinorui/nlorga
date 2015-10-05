NL.View.AdminOrganization = NL.View.AdminOrganization || Backbone.View.extend({
	defaults: {
		timeOutHandler: -1,
		organization: {},
		registry: [],
		partys: [],
		statistic: [],
		useroptions:{}
	},
	template: NL.Template["user-organization"],
	initialize: function (options) {
		this.options = _.extend(this.defaults, options);
		this.model = new NL.Model.OrganizationStatus({
			idstatus: this.options.organization.idstatus,
			idorganization: this.options.organization.idorganization
		});
		this.model.on('change', this.statusChange, this);
		this.render();
		this.statusChange(this.model);
		this.startTimer();
	},
	render: function () {
		this.$el.html(this.template(this.options));
	},
	startTimer: function () {
		var self = this;
		if (this.options.timeOutHandler < 0) {
			this.options.timeOutHandler = setInterval(function () {
				self.model.fetch({});
			}, 10000);
		}
	},
	stopTimer: function () {
		clearInterval(this.options.timeOutHandler);
		this.options.timeOutHandler = -1;
	},
	userModel:function(){
		if(this.options.useroptions.registry){
			return this.options.useroptions.registry;
		}else{
			return {idorganization: this.options.organization.idorganization};
		}	
	},
	showUserView: function (save) {
		this.userView = this.userView || new NL.View.UserOrganizationData({
			el:'.user-data',
			userprofessions: this.options.useroptions.userprofessions,
			user: this.options.useroptions.user,
			savebutton:save,
			model: new NL.Model.Registry(this.userModel())		
		});
		this.userView.showSave(save);
	},
	showPartyView: function (stopTimer) {
		this.partyView = this.partyView || new NL.View.OrganizationParty({
			el: '.party-data',
			partys: this.options.partys,
			idorganization: this.options.organization.idorganization,
			username:this.options.useroptions.user.username,
			jsviewname: this.options.organization.jsviewname
		});
		if (stopTimer) {
			this.partyView.stopTimer();
		} else {
			this.partyView.startTimer();
		}
	},
	showRegistryView: function (stopTimer) {
		this.registryView = this.registryView || new NL.View.OrganizationRegistry({
			el: '.registry-data',
			registry: this.options.registry,
			username:this.options.useroptions.user.username,
			idorganization: this.options.organization.idorganization
		});
		if (stopTimer) {
			this.registryView.stopTimer();
		} else {
			this.registryView.startTimer();
		}
	},
	removeUserView:function(){
		if(this.userView){
			this.userView.remove();
		}
	},	
	removeRegistryView:function(){
		if(this.registryView){
			this.registryView.remove();
		}
	},
	removePartyView:function(){
		if(this.partyView){
			this.partyView.remove();
		}
	},	
	statusChange: function (model) {
		console.log('status changed:' + model.get('idstatus'));
		var status = model.get('idstatus');
		if (status == 1) {
			this.removeUserView();
			this.removeRegistryView();
			this.removePartyView();
		}
		if (status == 2) {
			this.showUserView(true);
			this.showRegistryView(false);
			this.removePartyView();
		}
		if (status == 3) {
			this.showUserView(false);
			this.showRegistryView(false);
			this.showPartyView(false);
		}
		if (status == 4) {
			this.showUserView(false);
			this.showRegistryView(true);
			this.showPartyView(false);
		}
		if (status == 5) {
			this.showUserView(false);
			this.removeRegistryView();
			this.showPartyView(false);
		}
		if (status == 6) {
			this.showUserView(false);
			this.removeRegistryView();
			this.showPartyView(true);
			this.stopTimer();
		}
	}
});
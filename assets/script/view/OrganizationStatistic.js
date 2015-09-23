NL.View.OrganizationStatistic = NL.View.OrganizationStatistic || Backbone.View.extend({
	template:NL.Template['organization-statistic'],
	initialize:function(options){
		this.render();
	},
	render:function(){
		this.$el.html('');
		this.$el.html(this.template(this.collection.toJSON()));	
	}	
});
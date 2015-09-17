NL.View.OrganizationBase = NL.View.OrganizationBase || Backbone.View.extend({
	initialize:function(options){
		this.model = new NL.Model.Organization(options.model);
		this.model.on('change',this.OrganizationChange,this.model);
	},
	organizationChange: function(model){
		
	}
});
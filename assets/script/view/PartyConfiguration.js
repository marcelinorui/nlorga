NL.View.PartyConfiguration = NL.View.PartyConfiguration || Backbone.View.extend({
	template:NL.Template['admin-party-configuration'],
	className:'row',
	events:{
		'click .save':'save'	
	},
	initialize:function(options){		
		this.render();
	},
	render:function(){
		var self = this;
		this.$el.html('');
		this.$el.append(this.template(this.model.toJSON()));		
	},
	save:function(){
		console.log('save');
	},
	destroy:function(){
		this.collection.reset();
		this.remove();
	}	
});
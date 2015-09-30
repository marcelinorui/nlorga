NL.View.PartyConfiguration = NL.View.PartyConfiguration || Backbone.View.extend({
	template:NL.Template['admin-party-configuration'],
	className:'row',
	events:{
		'click .save':'save',
		'change input.rank':'rankChange'
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
	rankChange:function(e){
		var $target = $(e.currentTarget);
		var newRank = $target.val();
		var idx = $target.attr('data-idx');
		this.model.get('profession')[idx].rank = newRank;
	},
	destroy:function(){
		this.collection.reset();
		this.remove();
	}	
});
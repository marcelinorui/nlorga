NL.View.UserIndex = NL.View.UserIndex || Backbone.View.extend({
	className:'row',
	timerHandler:null,
	template:NL.Template['user-index'],
	initialize:function(){
		this.collection.on('collection:data-fetched', this.render, this);
		this.render();
		this.startTimer();
	},
	render:function(){
		var self = this;
		this.$el.html('');
		this.collection.forEach(function(model){
			self.$el.append(self.template(model.toJSON()));					
		});	
	},
	startTimer:function(){
		var self = this;
		this.timerHandler = setInterval(function(){
			self.collection.fetch();
		},10000);	
	},
	stopTimer:function(){
		clearTimeout(this.timerHandler);
	}
});
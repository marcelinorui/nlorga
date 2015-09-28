NL.View.PartyStatistic = NL.View.PartyStatistic || Backbone.View.extend({
	template:null,
	className:'row centered',
	initialize:function(options){		
/* _.chain(list).groupBy('profession').map(function(value, key) {    return {        profession: key,        count: value.length    }}).value();*/
		this.collection = new Backbone.Collection(options.statistic);
	},
	render:function(){
		var self = this;
		this.$el.html('');
		this.collection.foreach(function(elem){
			self.$el.append(self.template(elem));
		});
	},
	setData:function(statistics){
		this.collection.reset(statistics);
	},
	destroy:function(){
		this.collection.reset();
		this.remove();
	}	
});
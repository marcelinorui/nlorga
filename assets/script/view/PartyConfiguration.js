NL.View.PartyConfiguration = NL.View.PartyConfiguration || Backbone.View.extend({
	template:NL.Template['admin-party-configuration'],
	collectionTemplate:NL.Template['admin-party-configuration-profession'],
	className:'row',
	events:{
		'click .save':'save',
		'change input.rank':'rankChange'
	},
	defaults:{
		partyconfiguration:null,
		partyconfigurationprofession:[]	
	},
	initialize:function(options){
		this.options = _.extend(this.defaults, options);
		this.model = new NL.Model.PartyConfiguration(this.options.partyconfiguration);
		this.collection = new NL.Collection.PartyConfigurationProfession(this.options.partyconfigurationprofession);		
		this.render();
	},
	render:function(){
		var self = this;
		this.$el.html('');
		this.$el.append(this.template(this.model.toJSON()));
		this.$el.find('.profession').append(this.collectionTemplate(this.collection.toJSON()));		
	},
	save:function(){
		_.each(this.collection.models,function(_model){
			if( _model.hasChanged('rank') ){
				_model.save();
			}
		});

		this.model.set('description',this.$el.find('#description').val());
		this.model.set('jsviewname',this.$el.find('#jsviewname').val());
		this.model.set('pickbanner',this.$el.find('#pickbanner:checked').length > 0 ? true:false);
		this.model.set('pickfood',this.$el.find('#pickfood:checked').length > 0 ? true:false);
		this.model.set('pickcommander',this.$el.find('#pickcommander:checked').length > 0 ? true:false);

		this.model.save(null,{success:function(){
			toastr.success('The Configuration was saved succesfully.');
		}});
	},
	rankChange:function(e){
		var $target = $(e.currentTarget);
		var newRank = $target.val();
		var idx = $target.attr('data-idx');
		this.collection.at(idx).set('rank',newRank);
	},
	destroy:function(){
		this.collection.reset();
		this.remove();
	}	
});
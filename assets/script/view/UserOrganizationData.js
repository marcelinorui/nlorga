NL.View.UserOrganizationData = NL.View.UserOrganizationData || Backbone.View.extend({
	defaults:{
		userprofessions:[],
		user:{},
		savebutton:false
	},
	template: NL.Template['user-organization-register'],
	events: {
		'click .radio-select span': 'radioChange',
		'click .check-select span': 'checkboxChange',
		'click button':'buttonClick'		
	},
	initialize:function(options){
		this.options = _.extend(this.defaults, options);
		this.on('input:change',this.inputChange);
		this.render();
	},
	showSave:function(save){
		this.options.savebutton = save;
		this.render();
	},
	render:function(){
		var rend = _.extend(this.options, {registry: this.model.toJSON()});
		this.$el.html(this.template(rend));
	},
	radioChange: function (e) {
		var $parent = $(e.currentTarget).parent();
			$parent.find('.icon.selected')
					.removeClass('selected');
		$parent.find('input[type="radio"]')
				.removeAttr('checked');
		var $target = $(e.currentTarget);
		$target.addClass("selected");
		var val = $target.attr('data-input');
		var $input = $parent.find('input[type="radio"][value="' + val + '"]');
		$input.attr('checked', 'checked');
		this.trigger('input:change', { name: $input.attr('name'), value: val });
	},
	checkboxChange: function (e) {
		var $target = this.$(e.currentTarget);
		var val = $target.attr('data-input');
		var $input = $target.parent()
			.find('input[type="checkbox"][value="' + val + '"]');
		if ($target.hasClass('selected')) {
			$input.removeAttr('checked');
			$target.removeClass('selected');
			this.trigger('input:change', { name: $input.attr('name'), value: '' });
		} else {
			$input.attr('checked', 'checked');
			$target.addClass('selected')	;
			this.trigger('input:change', { name: $input.attr('name'), value: val });
		}		
	},	
	inputChange: function (obj) {
		var value = obj.value;
		if ( obj.name == 'havebanner' || obj.name == 'havefood'){
			value = obj.value == 'ok' ? true : false;
		}
		if(obj.name == 'idprofession'){
			value = Number(value);
		}
		this.model.set(obj.name,value);
	},
	buttonClick: function(){
		var self = this;
		this.model.save(null,{success:function(){ 
			toastr.success('Registration was successfull.');
			} 
		}).done(function(){
			self.trigger('userregistry:save', self.model.toJSON());	
		});
				
	}
});
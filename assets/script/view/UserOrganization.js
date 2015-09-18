NL.View.UserOrganization = NL.View.UserOrganization  || Backbone.View.extend({
	templateTop : null,
	templateMiddle : null,
	templateBottom : null,
	initialize:function(options){
		this.organization = options.organization;
		this.templateTop = options.templateTop || null;
		this.templateMiddle = options.templateMiddle || null;
		this.templateBottom = options.templateBottom || null;
	},	
	render: function(){
		
		/* if ( status id == 2 ) User can Update data*/
				
		/* Can view players registered id status = 2,3,4 */
		
		/* Can View Party composition id status = 4 */		
		
		
		return this;
	}		
});
NL.Collection.OrganizationPartyTeqZerg = NL.Collection.OrganizationPartyTeqZerg || NL.Collection.OrganizationParty.extend({
	defaults:{
		locations:["East","West","North","MegaLaser"]
	},
	setJobs:function(arr){
		for(var i = 0; i < arr.length; i++){
			arr[i].job = 'Battery Fase - '+this.options.locations[i%this.options.locations.length];
		}
		return arr;
	},
	parse:function(response){
		return this.setJobs(response);
	}	
});
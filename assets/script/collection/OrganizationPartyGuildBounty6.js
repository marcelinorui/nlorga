NL.Collection.OrganizationPartyGuildBounty6 = NL.Collection.OrganizationPartyGuildBounty6 || NL.Collection.OrganizationParty.extend({
	setJobs:function(arr){
		for(var t = 0; t < arr.length; t++){
			arr[t].job = ['Target - #'+ (t%6)+1 ];
		}
		return arr;
	},
	parse:function(response){
		return this.setJobs(response);
	}	
});
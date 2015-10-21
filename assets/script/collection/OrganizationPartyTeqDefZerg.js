NL.Collection.OrganizationPartyTeqDefZerg = NL.Collection.OrganizationPartyTeqDefZerg || NL.Collection.OrganizationParty.extend({
	defaults:{
		defLocations:["East","West","North","MegaLaser"],
		defJob:["East - Waypoint","East - Shipwreck","West - Beach","West - Shipwreck"],
		zergBattery:["East","MegaLazer"],
		defBattery:["North","North","West","West"]
	},
	setJobs:function(arr){
		var def = arr.slice(arr.length-4,4);
		var zerg = arr;
		for(var d = 0; d < def.length; d++){
			def[d].job = [ this.options.defJob[d],'Battery Fase - '+ this.options.defBattery[d]];
		}
		for(var z = 0; z < zerg.length; z++){
			zerg[z].job = ['Zerg','Battery Fase - '+this.options.zergBattery[z%2] ];
		}
		return def.concat(zerg);
	},
	parse:function(response){
		return this.setJobs(response);
	}	
});
var hash =require('password-hasher');

var utils = {
    createHashAndSalt : function(password){
        return hash.createHashAndSalt('ssha512',password,128);
    },
    shuffleList: function shuffleList(list) {
        var randId = 0;
        var pointId = null;
        var id = list.length - 1;
        while (id > 0) {
            randId = Math.floor(id * Math.random());
            pointId = list[id];
            list[id] = list[randId];
            list[randId] = pointId;
            id = id - 1;
        }
    },
    makeGroups: function (list, groupSize) {
        var groupID = 0;
        var groupIDs = new Array(list.length);
        var subjectID = 1;
        while (subjectID <= list.length) {
            groupIDs[subjectID - 1] = groupID;
            if (subjectID % groupSize == 0) {
                groupID = groupID + 1;
            }
            subjectID = subjectID + 1;
        }

        var groups = new Array(Math.ceil(list.length / groupSize));
        for (var i = 0; i < list.length; i++) {
            if (!groups[groupIDs[i]]) {
                groups[groupIDs[i]] = [];
            }
            groups[groupIDs[i]].push(list[i]);
        }
        return groups;
    },
    getProfession:function(list, profession, groupSize){
        var output = [];
        for(var i = 0; i < list.length; i++){
            if (list[i]['profession'] == profession){
                output.push(list[i]);
            }    
        }                
        return this.makeGroups(output,groupSize);        
    }
};

module.exports = utils;
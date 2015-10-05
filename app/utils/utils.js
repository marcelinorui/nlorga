var hash = require('password-hasher'),
    _ = require('lodash');

var utils = {
    createHashAndSalt: function (password) {
        return hash.createHashAndSalt('ssha', password, 128);
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
    makePartys: function (data, maxGroupSize, idorganization) {
        var groups = [];
        var numGroups = Math.ceil(data.registrys.length / maxGroupSize);
        for (var i = 0, g = 0; i < data.registrys.length; i++ , g = i % numGroups) {
            if (!groups[g]) {
                groups.push([]);
            }
            groups[g].push(data.registrys[i]);
        }
                
        for (var i = 0; i < groups.length; i++) {
            var idpartyname = data.partynames[i].idpartyname;
            for (var j = 0; j < groups[i].length; j++) {
                groups[i][j].idpartyname = idpartyname;
                groups[i][j].createddate = new Date();
                groups[i][j] = [
                    idorganization,
                    groups[i][j].idpartyname,
                    groups[i][j].idregistry,
                    groups[i][j].createddate];
            }
        }
        return _.flatten(groups);
    }
};

module.exports = utils;
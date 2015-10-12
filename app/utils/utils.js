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
    pickbanner: function (registrys) {
        var bannerRegistrys = _.select(registrys, function (r) {
            if (r.havebanner) {
                return r;
            }
        });
        var rnd = -1;
        if (bannerRegistrys) {
            rnd = _.random(0, bannerRegistrys.length-1);
        }

        for (var i = 0; i < registrys.length; i++) {
            if (rnd > 0) {
                if (registrys[i].idregistry == bannerRegistrys[rnd].idregistry) {
                    registrys[i].havebanner = 1;
                } else {
                    registrys[i].havebanner = 0;
                }
            }
            else {
                break;
            }
        }

        return registrys;
    },
    pickfood: function (registrys) {
        var foodRegistrys = _.select(registrys, function (r) {
            if (r.havefood) {
                return r;
            }
        });
        var rnd = -1;
        if (foodRegistrys) {
            rnd = _.random(0, foodRegistrys.length-1);
        }

        for (var i = 0; i < registrys.length; i++) {
            if (rnd > 0) {
                if (registrys[i].idregistry == foodRegistrys[rnd].idregistry) {
                    registrys[i].havefood = 1;
                } else {
                    registrys[i].havefood = 0;
                }
            }
            else {
                break;
            }
        }

        return registrys;
    },
    makePartys: function (data, maxGroupSize, idorganization) {
        var groups = [];
        var numGroups = Math.ceil(data.registrys.length / maxGroupSize);

        data.registrys = this.pickbanner(data.registrys);
        data.registrys = this.pickfood(data.registrys);

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
                    groups[i][j].havebanner,
                    groups[i][j].havefood,
                    //groups[i][j].havetag,
                    groups[i][j].createddate];
            }
        }
        return _.flatten(groups);
    }
};

module.exports = utils;
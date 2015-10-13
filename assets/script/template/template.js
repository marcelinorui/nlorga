this["NL"] = this["NL"] || {};
this["NL"]["Template"] = this["NL"]["Template"] || {};

this["NL"]["Template"]["OrganizationPartyGuildBounty2"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '';}return __p};

this["NL"]["Template"]["OrganizationPartyGuildBounty3"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '';}return __p};

this["NL"]["Template"]["OrganizationPartyGuildBounty6"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '';}return __p};

this["NL"]["Template"]["OrganizationPartyTeqDefZerg"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) { var zerg = obj.slice(4) ;__p +=((__t = ( NL.Template['tequatl-zerg-jobs'](zerg) )) == null ? '' : __t);}return __p};

this["NL"]["Template"]["OrganizationPartyTeqZerg"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) { var zerg = obj ;__p +=((__t = ( NL.Template['tequatl-zerg-jobs'](zerg) )) == null ? '' : __t);}return __p};

this["NL"]["Template"]["TeqZerg"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) { var guardians = _.where(obj, {profession:'guardian'})  ; if (guardians.length > 0) {;__p += '<br/><div class="row"><div class="col-lg-3"><img src="/img/skills/Wall_of_Reflection.png" /></div>'; var counter = 0 ; var start = 0 ; while(start < guardians.length - 1 ){;__p += '<div class="col-lg-3">';var group = guardians.slice(start,start+ 4 ); start += group.length ;++counter;__p += '<div class="list-group-item active"> Wall ' +((__t = ( counter )) == null ? '' : __t) +'</div>'; for(var i = 0; i < group.length; i++) {;__p += '<div class="list-group-item">' +((__t = ( group[i].username )) == null ? '' : __t) +'</div>';};__p += '</div>';};__p += '</div>'; } ; var elementalist = _.where(obj,{profession:'elementalist'}) ; var ele_group = elementalist.slice(0, 6) ; if(ele_group.length > 0) {;__p += '<br /><div class="row"><div class="col-lg-3"><img src="/img/skills/Swirling_Winds.png" /></div><div class="col-lg-3"><div class="list-group-item active">Swirling Winds</div>'; _.each(ele_group,function(ele,idx){;__p += '<div class="list-group-item"><span>SW #' +((__t = ( (idx+1) )) == null ? '' : __t) +'</span><span class="pull-right">' +((__t = ( ele.username)) == null ? '' : __t) +'</span></div>'; }); ;__p += '</div></div>'; } ; var warrior = _.where(obj,{profession:'warrior'}) ; var war_group = warrior.slice(0,6) ; if(war_group.length > 0) {;__p += '<br /><div class="row"><div class="col-lg-3"><img src="/img/skills/Battle_Standard.png" /></div><div class="col-lg-3"><div class="list-group-item active">Battle Standard</div>'; _.each(war_group,function(war,idx){;__p += '<div class="list-group-item"><span>Banner #' +((__t = ( (idx+1) )) == null ? '' : __t) +'</span><span class="pull-right">' +((__t = ( war.username)) == null ? '' : __t) +'</span></div>'; }); ;__p += '</div></div>'; } ;}return __p};

this["NL"]["Template"]["admin-accounts-row"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<tr '; if (obj.enddate){;__p += 'class="text-strikeout"'; };__p += ' ><td>' +__e( obj.idlogin ) +'</td><td>' +__e( obj.username ) +'</td><td>' +__e( obj.displayname ) +'</td><td>'; if (obj.hascommanderTag == 1) {;__p += '<span class="glyphicon glyphicon-ok text-success"></span>'; } ;__p += '</td><td>'; if (obj.idrole === 1) {;__p += 'Guild Member'; } else if (obj.idrole === 2){;__p += 'Commander'; } else if (obj.idrole >= 3){;__p += 'Administrator'; };__p += '</td><td>' +__e( obj.createddate.substring(0,10) ) +'</td><td><div class="btn-group pull-right"><a href="/admin/account/' +__e( obj.idlogin ) +'/edit" role="button" class="btn btn-success btn-sm" ><span class="glyphicon glyphicon-search"></span> Edit</a></div></td></tr>';}return __p};

this["NL"]["Template"]["admin-configurations-row"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<tr><td>' +__e( obj.idpartyconfiguration ) +'</td><td>' +__e( obj.description ) +'</td><td>'; if (obj.pickbanner == 1) {;__p += '<span class="glyphicon glyphicon-ok text-success"></span>'; } ;__p += '</td><td>'; if (obj.pickfood == 1) {;__p += '<span class="glyphicon glyphicon-ok text-success"></span>'; } ;__p += '</td><td>'; if (obj.pickcommander == 1) {;__p += '<span class="glyphicon glyphicon-ok text-success"></span>'; } ;__p += '</td><td>' +__e( obj.createddate.substring(0,10) ) +'</td><td>' +__e( obj.updateddate.substring(0,10) ) +'</td><td><span class="pull-right"><a href="/admin/configuration/' +__e(obj.idpartyconfiguration) +'/edit" role="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-search"></span> Edit</a></span></td></tr>';}return __p};

this["NL"]["Template"]["admin-organization-row"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<tr><td>' +__e( obj[i].idorganization ) +'</td><td>' +__e( obj[i].title ) +'</td><td>' +__e( obj[i].status ) +'</td><td>' +__e( obj[i].description ) +'</td><td>' +__e( obj[i].createddate.substring(0,10) ) +'<td><span class="pull-right"><a href="/commander/organization/' +__e(obj[i].idorganization) +'/edit" role="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-search"></span> Edit</a></span></td></tr>';}return __p};

this["NL"]["Template"]["admin-organizations-row"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<tr><td>' +__e( obj.idorganization ) +'</td><td>' +__e( obj.title ) +'</td><td><span class="label label-default">' +__e( obj.status ) +'</span></td><td>' +__e( obj.description ) +'</td><td>' +__e( obj.createddate.substring(0,10) ) +'<td><span class="pull-right"><a href="/commander/organization/' +__e(obj.idorganization) +'/edit" role="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-search"></span> Edit</a></span></td></tr>';}return __p};

this["NL"]["Template"]["admin-party-configuration-profession"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<h3>Choose Profession Rank</h3><div class="row">'; _.each(obj, function(p, idx){;__p += '<div class="col-lg-4"><div class="row"><div class="col-lg-offset-3 col-lg-3"><span class="icon-' +__e(p.idprofession) +' big"></span></div><div class="col-lg-4"><input type="text" value="' +((__t = (p.rank)) == null ? '' : __t) +'" data-idx="' +__e(idx) +'" class="form-control text-right rank" /></div></div></div>';});;__p += '</div><br>';}return __p};

this["NL"]["Template"]["admin-party-configuration"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<div class="col-lg-offset-2 col-lg-8"><div class="title"><h2>Edit Configuration <b>' +__e( description ) +'</b></h2></div><div class="row"><div class="col-lg-12"><label for="description">Description</label><input type="text" id="description" class="form-control" name="description" placeholder="Description" value=\'' +__e( description) +'\'/></div></div><div class="row"><div class="col-lg-12"><label for="jsviewname">View Name</label><select name="jsviewname" id="jsviewname" class="form-control">'; var jsviews = ['OrganizationPartyTeqZerg','OrganizationPartyTeqDefZerg','OrganizationPartyBounty2','OrganizationPartyBounty3','OrganizationPartyBounty6']; ;_.each(jsviews,function(jsview){;__p += '<option value="' +((__t = (jsview)) == null ? '' : __t) +'" ';if( jsviewname == jsview){;__p += 'seleted';};__p += '>' +((__t = (jsview)) == null ? '' : __t) +'</option>';});;__p += '</select></div></div><br><h3>Choose what users can pick</h3><div class="row"><div class="col-lg-2"><label for="isAdmin">Pick Banner</label></div><div class="col-lg-2"><input type="checkbox" id="pickbanner" name="pickbanner" data-style="btn-group-sm" ';if( pickbanner == true){;__p += 'checked';};__p += ' /></div><div class="col-lg-2"><label class="control-label" for="isAdmin">Pick Food</label></div><div class="col-lg-2"><input type="checkbox" id="pickfood" name="pickfood" data-style="btn-group-sm" ';if( pickfood == true){;__p += 'checked';};__p += '/></div><div class="col-lg-2"><label class="control-label" for="isAdmin">Pick Commander</label></div><div class="col-lg-2"><input type="checkbox" id="pickcommander" name="pickcommander" data-style="btn-group-sm" ';if( pickcommander == true){;__p += 'checked';};__p += '/></div></div><br><div class="profession"></div><hr><div class="row"><div class="col-lg-12"><div class=" pull-left"><a role="button" href="/admin/configurations" class="btn btn-default"> <span class="glyphicon glyphicon-arrow-left "></span>Back</a></div><div class=" pull-right"><button class="btn btn-primary save"> <span class="glyphicon glyphicon-ok "></span> Save</button></div></div></div></div>';}return __p};

this["NL"]["Template"]["organization-foodbanner"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {if( foodusername || bannerusername){;__p += '<div class="row centered">';if(foodusername){;__p += '<div class="col-lg-6"><p class="text-center"><span class="food-icon big"></span> Food will be provided by <b>' +((__t = ( foodusername )) == null ? '' : __t) +'</b> </p></div>';};if(bannerusername){;__p += '<div class="col-lg-6"><p  class="text-center"><span class="banner-icon big"></span> Banner will be provided by <b>' +((__t = ( bannerusername )) == null ? '' : __t) +'</b></p></div>';};__p += '</div>';};}return __p};

this["NL"]["Template"]["organization-party"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<div class="row">'; _.each(partys, function(party,idx){ ;__p += '<div class="col-lg-3"><div class="list-group"><div class="list-group-item active"><b> ' +__e( party.partyname ) +'</b> <span class="badge">' +__e( party.members.length) +'</span></div>'; if(party.job){ ; if( Array.isArray(party.job) ){ ;	_.each(party.job, function(job) {;__p += '<div class="list-group-item list-group-item-warning"><b>' +__e( job ) +'</b></div>'; }) ; } else { ;__p += '<div class="list-group-item list-group-item-warning"><b>' +__e( party.job ) +'</b></div>'; } ; } ;__p += '<div class="list-group-item ">'; _.each(party.members,function(member){ ;__p += '<div class="player '; if ( member.username == username ) {;__p += ' bg-success ';};__p += '"><span class="' +__e( member.profession) +'-icon"></span>'; if( member.commander) { ;__p += '<span class="' +__e( member.commander) +'-icon"></span>'; } ; if( member.havebanner == true ) { ;__p += '<span class="banner-icon"></span>'; } ; if( member.havefood == true ) { ;__p += '<span class="food-icon"></span>'; } ;__p += '<span class="user">' +__e( member.displayname != '' ? member.displayname : member.username ) +'</span></div>';});;__p += '</div><div class="list-group-item list-group-item-info text-center"><span>/join ' +__e(party.members[0].username ) +'</span></div></div></div>'; if ((idx+1 % 4) == 0 ) {;__p += '<br />';};});;__p += '</div>';/*  function SelectText(element) {var doc = document, text = doc.getElementById(element), range, selection;if (doc.body.createTextRange) {range = document.body.createTextRange();range.moveToElementText(text);range.select();} else if (window.getSelection) {selection = window.getSelection();range = document.createRange();range.selectNodeContents(text);selection.removeAllRanges();selection.addRange(range);}}document.onclick = function(e) {if (e.target.className === 'click') {SelectText('selectme');}};*/;}return __p};

this["NL"]["Template"]["organization-registry"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<div class="row">'; for (var col = 0; col < 4; col++) {; var registrys_col = _.select(registrys,function(r,idx){ return idx%4 == col; });__p += '<div class="col-lg-3"><div class="list-group">'; _.each(registrys_col,function(r){ ; if ( r.username == obj.username ){;__p += '<div class="list-group-item list-group-item-success">';}else{;__p += '<div class="list-group-item">';};__p += '<span class="' +__e( r.profession) +'-icon"></span>'; if( r.haveTag != '' ) { ;__p += '<span class="' +__e( r.commander) +'-icon"></span>'; } ; if( r.havebanner == true ) { ;__p += '<span class="banner-icon"></span>'; } ; if( r.havefood == true ) { ;__p += '<span class="food-icon"></span>'; } ;__p += '<span class="pull-right">' +__e( r.displayname != '' ? r.displayname : r.username ) +'</span></div>'; }); ;__p += '</div></div>'; } ;__p += '</div>';}return __p};

this["NL"]["Template"]["organization-statistic"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<br/><div class="row centered">';var sum = 0;_.each(obj,function(s){;sum += s.value;; }); ;__p += '<div class="col-lg-6"><h4 class="text-center"><b>Participating Players: ' +((__t = (sum)) == null ? '' : __t) +'</b></h4></div></div><div class="row centered">'; _.each(obj,function(s){ ;__p += '<div class="col-lg-1"><span class="' +__e( s.name ) +'-icon"></span><label class="counter">' +__e( s.value ) +'</label></div>'; }); ;__p += '</div><br/>';}return __p};

this["NL"]["Template"]["pager-template"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<div class="row"><div class="col-lg-3">'; if ( pageCount > 0) { ;__p += '<span><b>Page ' +__e( currentPage ) +' of ' +__e( pageCount ) +'</b></span>'; } ;__p += '</div><div class="col-lg-6 text-center">'; if (pageCount > 1) { ;__p += '<nav><ul class="pagination">'; if (currentPage > 1) { ;__p += '<li><a href="#" data-pager=\'' +__e( parseInt(currentPage,10)-1 ) +'\'><span class="glyphicon glyphicon-menu-left"></span></a></li>'; } ; var i = 1;if (currentPage > 5) {i = +currentPage - 4;} ; if (i !== 1) { ;__p += '<li class="disabled"><a href="#">...</a></li>'; } ; for (i; i<=pageCount; i++) { ; if (currentPage == i) { ;__p += '<li class="active"><span>' +((__t = ( i )) == null ? '' : __t) +' <span class="sr-only">(current)</span></span></li>'; } else { ;__p += '<li><a href="#" data-pager=\'' +((__t = ( i )) == null ? '' : __t) +'\'>' +((__t = ( i )) == null ? '' : __t) +'</a></li>'; } ; if (i == (+currentPage + 4)) { ;__p += '<li class="disabled"><a href="#">...</a></li>'; break; } ; } ; if (currentPage != pageCount) { ;__p += '<li><a href="#" data-pager=\'' +__e( parseInt(currentPage,10)+1 ) +'\'><span class="glyphicon glyphicon-menu-right"></span></a></li>'; } ;__p += '</ul></nav>'; } ;__p += '</div><div class="col-lg-3">'; if ( pageCount > 0) { ;__p += '<div class="row"><label class="col-lg-offset-4 col-lg-3"> Items:</label><div class="col-lg-5"><select class="form-control"><option value="10" ' +__e( itemsPerPage == 10 ? "selected" : "" ) +' >10</option><option value="25" ' +__e( itemsPerPage == 25 ? "selected" : "" ) +' >25</option><option value="50" ' +__e( itemsPerPage == 50 ? "selected" : "" ) +' >50</option><option value="100" ' +__e( itemsPerPage == 100 ? "selected" : "" ) +' >100</option></select></div></div>'; } ;__p += '</div></div>';}return __p};

this["NL"]["Template"]["tequatl-zerg-jobs"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) { var zerg = _.chain(obj).pluck('members').flatten().value() ; var guardians = _.where(zerg, {profession:'guardian'})  ; if (guardians.length > 0) {;__p += '<br/><div class="row"><div class="col-lg-3"><img src="/img/skills/Wall_of_Reflection.png" /></div>'; var counter = 0 ; var start = 0 ; while(start < guardians.length - 1 ){;__p += '<div class="col-lg-3">';var group = guardians.slice(start,start+ 4 ); start += group.length ;++counter;__p += '<div class="list-group-item active"><b> Wall ' +((__t = ( counter )) == null ? '' : __t) +'</b></div>'; for(var i = 0; i < group.length; i++) {;__p += '<div class="list-group-item">' +((__t = ( group[i].username )) == null ? '' : __t) +'</div>';};__p += '</div>';};__p += '</div>'; } ; var warrior = _.where(zerg,{profession:'warrior'}) ; var war_group = warrior.slice(0,6) ; if(war_group.length > 0) {;__p += '<br /><div class="row"><div class="col-lg-3"><img src="/img/skills/Battle_Standard.png" /></div><div class="col-lg-3"><div class="list-group-item active"><b>Battle Standard</b></div>'; _.each(war_group,function(war,idx){;__p += '<div class="list-group-item"><span>Banner #' +((__t = ( (idx+1) )) == null ? '' : __t) +'</span><span class="pull-right">' +((__t = ( war.username)) == null ? '' : __t) +'</span></div>'; }); ;__p += '</div></div>'; } ; var elementalist = _.where(zerg,{profession:'elementalist'}) ; var ele_group = elementalist.slice(0, 6) ; if(ele_group.length > 0) {;__p += '<br /><div class="row"><div class="col-lg-3"><img src="/img/skills/Swirling_Winds.png" /></div><div class="col-lg-3"><div class="list-group-item active"><b>Swirling Winds</b></div>'; _.each(ele_group,function(ele,idx){;__p += '<div class="list-group-item"><span>SW #' +((__t = ( (idx+1) )) == null ? '' : __t) +'</span><span class="pull-right">' +((__t = ( ele.username)) == null ? '' : __t) +'</span></div>'; }); ;__p += '</div></div>'; } ;}return __p};

this["NL"]["Template"]["user-index"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="col-offset-lg-1 col-lg-3"><div class="thumbnail"><p class="text-center"><b>' +__e( title ) +'</b></p><p class="text-center">' +__e( configuration) +'</p><p class="text-center"><span class="label label-success">' +__e( description ) +'</span></p><div class="text-center"><span><a href="/user/organization/' +__e(idorganization) +'/view" role="button" class="btn btn-primary btn-sm">Join The Fight</a></span></div></div></div>';}return __p};

this["NL"]["Template"]["user-organization-register"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape, __j = Array.prototype.join;function print() { __p += __j.call(arguments, '') }with (obj) {__p += '<div class="well"><div class="row"><div class="col-lg-6"><h3 class="text-center">' +__e( obj.user.displayname != '' ? obj.user.displayname : obj.user.username ) +'</h3></div><div class="col-lg-6"><h3 class="text-center"><b>' +((__t = ( obj.user.title )) == null ? '' : __t) +'</b> - ' +__e( obj.user.description ) +'</h3></div></div><div class="row centered">'; if (obj.user.idstatus == 2) { ;__p += '<div class="col-lg-6"><div class="radio-select profession">'; for(var i = 0; i < obj.userprofessions.length; i++ ){ ;if(registry.idprofession ==  obj.userprofessions[i].idprofession){;__p += '<span class="icon ' +__e( obj.userprofessions[i].name ) +'-icon big selected" data-input="' +__e( obj.userprofessions[i].idprofession ) +'" ><input name="idprofession" value="' +__e( obj.userprofessions[i].idprofession ) +'" type="radio" checked /></span>';} else {;__p += '<span class="icon ' +__e( obj.userprofessions[i].name ) +'-icon big" data-input="' +__e( obj.userprofessions[i].idprofession ) +'" ><input name="idprofession" value="' +__e( obj.userprofessions[i].idprofession ) +'" type="radio" /></span>'; } ; } ;__p += '</div></div>'; if( obj.user.pickbanner == true ) { ;__p += '<div class="col-lg-2"><div class="check-select banner">'; if(registry.havebanner == true) {;__p += '<span class="icon banner-icon big selected" data-input="ok" ><input type="checkbox" name="havebanner" value="ok" checked /></span>';} else {;__p += '<span class="icon banner-icon big" data-input="ok" ><input type="checkbox" name="havebanner" value="ok" /></span>';};__p += '</div></div>'; } ; if( obj.user.pickfood  == true ) { ;__p += '<div class="col-lg-2"><div class="check-select food">'; if(registry.havefood == true) {;__p += '<span class="icon food-icon big selected" data-input="ok" ><input type="checkbox" name="havefood"  value="ok" checked /></span>';}else{;__p += '<span class="icon food-icon big" data-input="ok" ><input type="checkbox" name="havefood"  value="ok" /></span>';};__p += '</div></div>'; } ; if( obj.user.pickcommander  == 1 ) { ;__p += '<div class="col-lg-2"><div class="radio-select commander">'; var comm = ["blue","yellow","purple","red"]; ; for (var i = 0 ; i< comm.length; i++){ ;if( registry.haveTag == comm[i]){;__p += '<span class="icon ' +__e( comm[i]) +'-icon big selected" data-input="' +__e( comm[i]) +'"><input type="radio" name="havetag" value="' +__e( comm[i]) +'" checked/></span>';}else{;__p += '<span class="icon ' +__e( comm[i]) +'-icon big" data-input="' +__e( comm[i]) +'"><input type="radio" name="havetag" value="' +__e( comm[i]) +'" /></span>';}; };__p += '<span class="icon no-commander-icon big" data-input="" ><input type="radio" name="havetag" value="" /></span></div></div>'; } ;__p += '<div class="col-lg-12"><span class="pull-right"><button class="btn btn-primary">Sign Up For Duty</button></span></div>'; } else {;__p += '<div class="col-lg-2"><div class="profession"><span class="icon ' +__e( registry.name ) +'-icon big"></span></div></div>'; if( user.pickbanner === true && registry.havebanner === true) { ;__p += '<div class="col-lg-2"><div class="banner"><span class="icon banner-icon big"></span></div></div>'; } ; if( user.pickfood === true && registry.havefood === true) { ;__p += '<div class="col-lg-2"><div class="food"><span class="icon food-icon big"></span></div></div>'; } ;};__p += '</div></div>';}return __p};

this["NL"]["Template"]["user-organization"] = function(obj) {obj || (obj = {});var __t, __p = '', __e = _.escape;with (obj) {__p += '<div class="user-data"></div><div class="registry-data"></div><div class="party-data"></div>';}return __p};
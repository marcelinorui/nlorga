use `nl`;
##############################################################
#						login
##############################################################

drop procedure if exists `verifylogin`;
delimiter $$
create procedure `verifylogin`(
	in_username varchar(50),
	in_password varchar(128)
)
begin	
    select password, salt
    into @password, @salt
	from login
	where username = in_username;
	
	if sha1(concat(@salt,in_password)) = @password then
	
		select idlogin, username,displayname, hascommandertag, idrole
        from login
        where username = in_username
        and (enddate is null OR enddate > now());
	else
		signal sqlstate '45000' set message_text = 'Invalid username/password ';
	end if;
end$$
delimiter ;


##############################################################
##						user
##############################################################

drop procedure if exists `changeloginpassword`;
delimiter $$
create procedure `changeloginpassword` (
in_idlogin int,
in_password varchar(128)
)
begin
	update `login`
    set `password` = sha1(concat(salt,in_password)),
		updateddate = now()
    where idlogin = in_idlogin;
end
$$
delimiter ;

drop procedure if exists `changeuserprofile`;
delimiter $$  
create procedure changeuserprofile(
	in_idlogin int,
    in_displayname varchar(50),
    in_hascommandertag tinyint,
    in_professions varchar(255),
    in_split varchar(1)
)
begin
	
    delete from loginprofession
    where idlogin = in_idlogin;
    
	set @string      = in_professions;
	set @occurrences = length(@string) - length(replace(@string, in_split, ''));
	myloop: while (@occurrences > 0)
	do 
		set @myvalue = substring_index(@string, ',', 1);
		if (@myvalue != '') then
		
			set @in_profession = cast(@myvalue as unsigned int);
			
			insert into loginprofession 
			values (in_idlogin,@in_profession);
			
		else
			leave myloop; 
		end if;
		set @occurrences = length(@string) - length(replace(@string, in_split, ''));
		if (@occurrences = 0) then 
			leave myloop; 
		end if;
		set @string = substring(@string,length(substring_index(@string, in_split, 1))+2);
	end while; 
    
    update login
    set displayname = in_displayname,
		hascommandertag = in_hascommandertag,
        updateddate = now()
	where idlogin = in_idlogin;
    
end $$
delimiter ;

drop procedure if exists `getuserprofile`;
delimiter $$
create procedure `getuserprofile` (
	in_idlogin int
)
begin
	select l.displayname,l.username, l.hascommandertag
    from login l 
    where l.idlogin = in_idlogin;

select p.name, count(l.idlogin)  as active 
 from loginprofession l
	right join profession p
    on l.idprofession = p.idprofession 
    and l.idlogin = in_idlogin         
    where p.active = 1
    group by p.name
    order by p.idprofession;
end
$$
delimiter ;

##############################################################
##						profession
##############################################################



drop procedure if exists `getallprofessions`;
delimiter $$
create procedure `getallprofessions` ()
begin
select *
 from profession p 
 where p.active = 1
 order by p.idprofession;
end
$$
delimiter ;


##############################################################
##						account
##############################################################


drop procedure if exists `getaccount`;
delimiter $$
create procedure `getaccount` (
	in_idlogin int
)
begin
    select idlogin, username, displayname, 
			hascommandertag, idrole, createddate, updateddate, enddate
	from login
	where idlogin = in_idlogin;
end
$$
delimiter ;



drop procedure if exists `createaccount`;
delimiter $$
create procedure `createaccount` (
in_username varchar(50),
in_password varchar(128),
in_displayname varchar(50),
in_salt varchar(128),
in_hascommandertag tinyint,
in_idrole tinyint
)
begin
	insert into `login`(`username`,`password`,`salt`,`displayname`,`hascommandertag`,`idrole`,`createddate`,`updateddate`,`enddate`)
	values (in_username,
		    in_password,
            in_salt,
            in_displayname,
            in_hascommandertag,
			in_idrole,
			now(),
			now(),
			NULL);
end
$$
delimiter ;



drop procedure if exists `updateaccount`;
delimiter $$
create procedure `updateaccount` (
	in_idlogin int,
	in_username varchar(50),
	in_displayname varchar(50),
	in_hascommandertag tinyint,
	in_idrole tinyint,
	in_delete tinyint
)
begin
	update `login`
    set idrole = in_idrole,
		username = in_username,
		displayname = in_displayname,
		hascommandertag = in_hascommandertag,
		updateddate = now(),
        enddate = case when in_delete = 1 then now() else NULL end
    where idlogin = in_idlogin;
end
$$
delimiter ;

##############################################################
##						organization
##############################################################


drop procedure if exists `createorganization`;
delimiter $$
create procedure `createorganization` (
in_idpartyconfiguration int,
in_title varchar(50)
)
begin
	insert into `organization`(`idstatus`,`idpartyconfiguration`,`title`,`createddate`,`updateddate`,`enddate`)
	values (1,
		    in_idpartyconfiguration,
            in_title,           
			now(),
			now(),
			NULL);
            
	select last_insert_id();
end
$$
delimiter ;

drop procedure if exists `getorganization`;
delimiter $$
create procedure `getorganization` (
in_idorganization int
)
begin
	select idstatus into @mystatus
    from organization 
    where idorganization = in_idorganization;

    select o.idorganization, 
		   o.idstatus, 
           s.description as status,
           p.idpartyconfiguration,
           p.description,
           p.jsviewname,
           o.title,
           o.createddate,
           o.updateddate, 
           o.enddate
	from organization o 
    inner join partyconfiguration p 
    on o.idpartyconfiguration = p.idpartyconfiguration
    inner join status s
    on o.idstatus = s.idstatus
	where o.idorganization = in_idorganization;
    
    if @mystatus in( 1) then
		call getactivepartyconfiguration();
    
    elseif @mystatus in (2,3) then
        call getregistrys(in_idorganization); 
        call getstatistics(in_idorganization);
	elseif @mystatus in(4,5,6) then
		call getpartys(in_idorganization);
        call getstatistics(in_idorganization);
	end if;  
    
    
end
$$
delimiter ;

drop procedure if exists `getorganizationstatus`;
delimiter $$
create procedure `getorganizationstatus` (
in_idorganization int
)
begin
	select idorganization,idstatus
    from organization
    where idorganization = in_idorganization;
end
$$
delimiter ;

drop procedure if exists `getorganizationforuser`;
delimiter $$
create procedure `getorganizationforuser` (
	in_idorganization int,
    in_idlogin int
)
begin
	call getuserorganizationconfiguration(in_idorganization,in_idlogin);
   
   select idstatus into @mystatus
    from organization 
    where idorganization = in_idorganization;

    select o.idorganization, 
		   o.idstatus, 
           s.description as status,
           p.idpartyconfiguration,
           p.description,
           p.jsviewname,
           o.title,
           o.createddate,
           o.updateddate, 
           o.enddate
	from organization o 
    inner join partyconfiguration p 
    on o.idpartyconfiguration = p.idpartyconfiguration
    inner join status s
    on o.idstatus = s.idstatus
	where o.idorganization = in_idorganization;
    
    if @mystatus in( 1) then
		call getactivepartyconfiguration();    
    elseif @mystatus in (2,3) then
        call getregistrys(in_idorganization); 
	elseif @mystatus in (4) then
		call getregistrys(in_idorganization);
        call getpartys(in_idorganization);
	elseif @mystatus in(5,6) then
		call getpartys(in_idorganization);
	end if;
end
$$
delimiter ;


drop procedure if exists `getstatistics`;
delimiter $$
create procedure `getstatistics` (
	in_idorganization int
)
begin
     select p.idprofession, p.name, count(a.idregistry)  as value 
    from organizationregistry a 
	right join profession p on a.idprofession = p.idprofession
    where a.idorganization = in_idorganization and p.active = 1
    group by p.name;
   
end
$$
delimiter ;

drop procedure if exists `updateorganization`;
delimiter $$
create procedure `updateorganization` (
in_idorganization int,
in_title varchar(255),
in_idpartyconfiguration int
)
begin
    update organization
    set title = in_title,
		idpartyconfiguration = in_idpartyconfiguration,
		updateddate = now()
	where idorganization = in_idorganization;    
end
$$
delimiter ;


drop procedure if exists `movestatusorganization`;
delimiter $$
create procedure `movestatusorganization` (
in_idorganization int,
in_idstatus int
)
begin
	set @idstatus = in_idstatus +1;
    
    update organization
    set idstatus = @idstatus,
		updateddate = now(),
        enddate = case when @idstatus = 5 then now() else NULL end
	where idorganization = in_idorganization;    
    
end
$$
delimiter ;

drop procedure if exists `resetorganization`;
delimiter $$
create procedure `resetorganization` (
	in_idorganization int
)
begin
	delete from organizationparty
    where idorganization = in_idorganization;
    
    delete from organizationregistry
    where idorganization = in_idorganization;

    update organization
    set idstatus = 1,
		updateddate = now(),
        enddate = NULL
	where idorganization = in_idorganization;    
end
$$
delimiter ;

drop procedure if exists `getregistrys`;
delimiter $$
create procedure `getregistrys` (
	in_idorganization int
)
begin
	select l.username
		  ,l.displayname
		  ,p.name as profession
		  ,r.havebanner
		  ,r.havefood
		  ,r.havetag
	from organizationregistry r 
	inner join login l
	on r.idlogin = l.idlogin
	inner join profession p 
	on r.idprofession = p.idprofession
	where r.idorganization = in_idorganization
	order by idregistry;
end
$$
delimiter ;

drop procedure if exists `getregistrysforpartys`;
delimiter $$
create procedure `getregistrysforpartys` (
	in_idorganization int
)
begin
	select r.idregistry,
		   p.idprofession,
           r.havefood,
           r.havebanner,
           r.havetag
	from organizationregistry r 
	inner join profession p 
		on r.idprofession = p.idprofession
    inner join organization o
		on r.idorganization = o.idorganization
    inner join partyconfiguration oc
		on o.idpartyconfiguration = oc.idpartyconfiguration
    inner join partyconfigurationprofession pcp
		on oc.idpartyconfiguration = pcp.idpartyconfiguration 
        and p.idprofession = pcp.idprofession
	where o.idorganization = in_idorganization
	order by pcp.rank;
    
    select idpartyname from partyname order by rand();
end
$$
delimiter ;


drop procedure if exists `getpartys`;
delimiter $$
create procedure `getpartys` (
	in_idorganization int
)
begin
	select p.name as partyname
	  ,l.username
	  ,l.displayname
	  ,prof.name as profession
	  ,o.havebanner
	  ,o.havefood
	  ,r.havetag
	from organizationparty o 
	inner join organizationregistry r 
	on o.idregistry = r.idregistry
	inner join partyname p 
	on o.idpartyname = p.idpartyname
    inner join login l 
    on r.idlogin = l.idlogin
    inner join profession prof
    on r.idprofession = prof.idprofession
	where r.idorganization = in_idorganization
	order by o.idorganizationparty;
end
$$
delimiter ;

drop procedure if exists `cleanpartys`;
delimiter $$
create procedure `cleanpartys` (
	in_idorganization int
)
begin
    delete from organizationparty
    where idorganization = in_idorganization;

    update organization
    set updateddate = now()        
	where idorganization = in_idorganization;    
end
$$
delimiter ;

drop procedure if exists `getactiveorganizations`;
delimiter $$
create procedure `getactiveorganizations` (
	in_idlogin int
)
begin
	select distinct o.idorganization, o.title, p.description as configuration, p.jsviewname, o.idstatus, s.description, case when r.idlogin  is not null then 1 else 0 end userinorganization
	from organization o inner join status s
    on o.idstatus = s.idstatus
    inner join partyconfiguration p 
    on o.idpartyconfiguration = p.idpartyconfiguration
    left join organizationregistry r 
    on o.idorganization = r.idorganization  and r.idlogin = in_idlogin
    where o.idstatus in (2,3,4,5)
	order by o.idorganization;
end
$$
delimiter ;


drop procedure if exists `getuserorganizationconfiguration`;
delimiter $$
create procedure `getuserorganizationconfiguration` (
	in_idorganization int,
    in_idlogin int
)
begin
	select o.idorganization,
		   o.idstatus,
		   l.username,
		   l.displayname,
		   o.title,
		   pc.description,
		   case when pc.pickcommander = 1 then l.hascommandertag else 0 end pickcommander,
		   pc.pickbanner, 
		   pc.pickfood       
	from organization o inner join partyconfiguration pc
	on o.idpartyconfiguration = pc.idpartyconfiguration 
	cross join login l 
	where o.idorganization = in_idorganization
	and l.idlogin = in_idlogin;
    
	select p.name, p.idprofession
	from login l
    inner join loginprofession lp
    on l.idlogin = lp.idlogin
	inner join profession p
    on lp.idprofession = p.idprofession 
    and p.active = 1 
	where l.idlogin = in_idlogin
	order by p.idprofession;    
    
    select r.idregistry,r.idorganization,r.idprofession, p.name,r.havefood,r.havebanner,r.havetag
    from organizationregistry r inner join profession p 
    on r.idprofession = p.idprofession
    where r.idorganization = in_idorganization
    and r.idlogin = in_idlogin;
    
end
$$
delimiter ;


drop procedure if exists `addorganizationuser`;
delimiter $$
create procedure `addorganizationuser` (
in_idorganization int,
in_idlogin int,
in_idprofession int,
in_havefood tinyint,
in_havebanner tinyint,
in_havetag varchar(10)
)
begin
	select count(idregistry), idregistry
	into @count, @idregistry
	from organizationregistry
    where idorganization = in_idorganization
    and idlogin = in_idlogin;
    
    if @count = 0 then
		insert into organizationregistry (`idorganization`, `idlogin`, `idprofession`, `havefood`, `havebanner`, `havetag`, `createddate`, `updateddate`) 
		values(
			in_idorganization,
			in_idlogin,
			in_idprofession,
			in_havefood,
			in_havebanner,
			in_havetag,
			now(),
			now()
		);
    else
		update organizationregistry
		set idprofession = in_idprofession,
			havefood = in_havefood,
			havebanner = in_havebanner,
			havetag = in_havetag,
			updateddate = now()
		where idregistry = @idregistry
		and idorganization = in_idorganization
		and idlogin = in_idlogin;
    
    end if;

end
$$
delimiter ;

##############################################################
##						party configuration
##############################################################
drop procedure if exists `getactivepartyconfiguration`;
delimiter $$
create procedure `getactivepartyconfiguration` ()
begin
    select idpartyconfiguration, description,jsviewname 
,pickfood 
,pickbanner 
,pickcommander
	from partyconfiguration
	where enddate IS NULL;
end
$$
delimiter ;

drop procedure if exists `createconfiguration`;
delimiter $$
create procedure `createconfiguration` (
 in_description varchar(255),
 in_jsviewname varchar(255),
 in_pickbanner tinyint,
 in_pickfood tinyint,
 in_pickcommander tinyint
)
begin
  insert into `partyconfiguration`
(`description`,
`jsviewname`,
`pickfood`,
`pickbanner`,
`pickcommander`,
`createddate`,
`updateddate`,
`enddate`)
values
(in_description,
in_jsviewname,
in_pickfood,
in_pickbanner,
in_pickcommander,
now(),
now(),
'9999-12-31 23:59:59');

set @idpartyconfiguration = last_insert_id();
insert into partyconfigurationprofession (idpartyconfiguration,idprofession,rank,makeextragroup,groupname,createddate,updateddate)
select @idpartyconfiguration, idprofession, -1, 0, '', now(),now() 
from profession;


select @idpartyconfiguration;

end
$$
delimiter ;



drop procedure if exists `getconfiguration`;
delimiter $$
create procedure `getconfiguration` (
in_idpartyconfiguration int
)
begin
	select idpartyconfiguration, 
    description, 
    jsviewname, 
    pickfood, 
    pickbanner, 
    pickcommander, 
    createddate, 
    updateddate, 
    enddate
    from partyconfiguration 
    where idpartyconfiguration = in_idpartyconfiguration;
    
    select idpartyconfigurationprofession, 
    idpartyconfiguration, 
    idprofession, 
    rank, 
    makeextragroup, 
    groupname, 
    createddate, 
    updateddate
    from partyconfigurationprofession 
    where idpartyconfiguration = in_idpartyconfiguration;
end
$$
delimiter ;

drop procedure if exists `saveconfiguration`;
delimiter $$
create procedure `saveconfiguration` (
in_idpartyconfiguration int,
in_description varchar(255), 
in_jsviewname varchar(255) ,
in_pickbanner tinyint(4), 
in_pickfood tinyint(4) ,
in_pickcommander tinyint(4)
)
begin
    update partyconfiguration
    set description = in_description,
		jsviewname = in_jsviewname,
		pickfood = in_pickfood,
        pickbanner = in_pickbanner,
        pickcommander = in_pickcommander,
        updateddate = now()
	where idpartyconfiguration = in_idpartyconfiguration;    
end
$$
delimiter ;


drop procedure if exists `saveconfigurationprofession`;
delimiter $$
create procedure `saveconfigurationprofession` (
in_idpartyconfigurationprofession int,
in_rank int 
)
begin
    update partyconfigurationprofession
    set rank = in_rank,		
        updateddate = now()
	where idpartyconfigurationprofession = in_idpartyconfigurationprofession;    
end
$$
delimiter ;

##############################################################
##						testing purposes
##############################################################
drop procedure if exists `populatepartyregistrys`;
delimiter $$
create procedure `populatepartyregistrys` (
	in_idorganization int
)
begin

delete from organizationregistry 
where idorganization = in_idorganization;

set @idorga = in_idorganization;
set @rand = ceil((rand() * (select count(1) from login) ));
set @sql = 'insert into organizationregistry (`idorganization`, `idlogin`, `idprofession`, `havefood`, `havebanner`, `havetag`, `createddate`, `updateddate`) select ?, idlogin, (select idprofession from profession where active = 1 order by rand() limit 1) as idprofession , round(rand()) havefood, round(rand()) havebanner,'''' ,now(), now() from login where idlogin > ceil((rand() * (select count(1) from login) )) order by rand() limit ?';

prepare stmt from @sql;
execute stmt using @idorga, @rand;
deallocate prepare stmt;

end
$$
delimiter ;

drop procedure if exists `makeorganizationpartys`;
delimiter $$
create procedure `makeorganizationpartys` (
	in_idorganization int,
    in_groupsize int
)
begin

delete from organizationparty 
where idorganization = in_idorganization;

## get how many groups we will have
select ceil((select count(idregistry) from organizationregistry where idorganization = in_idorganization)  / in_groupsize) as count
into @count;

## get random partynames for the number of groups we have
drop temporary table  if exists temp_partynames;
create temporary table temp_partynames ( id int not null primary key auto_increment, idpartyname int not null);
insert into temp_partynames (idpartyname)
	select idpartyname from partyname order by rand();

delete from temp_partynames
where id > @count +1;


## get all the registration by the rank configuration
drop temporary table  if exists temp_registrys;
create temporary table temp_registrys ( id int not null primary key auto_increment, idregistry int not null, idprofession int not null);
insert into temp_registrys (idregistry,idprofession)
	select r.idregistry,
		   p.idprofession
	from organizationregistry r 
	inner join profession p 
	on r.idprofession = p.idprofession
	inner join organization o
	on r.idorganization = o.idorganization
	inner join partyconfiguration oc
	on o.idpartyconfiguration = oc.idpartyconfiguration
	inner join partyconfigurationprofession pcp
	on oc.idpartyconfiguration = pcp.idpartyconfiguration 
	and p.idprofession = pcp.idprofession
	where o.idorganization = in_idorganization
	order by pcp.rank;

## split the registrations by the number of partys we have
insert into organizationparty  (idorganization,idpartyname,idregistry,havefood,havebanner, createddate)
	select in_idorganization, p.idpartyname , r.idregistry ,0 ,0, now()
	from temp_registrys r , temp_partynames p 
	where r.id % @count + 1  = p.id
	order by p.id;

## get 1 random food
select idregistry
into @foodid
from organizationregistry 
where idorganization = in_idorganization 
and havefood = 1
order by rand()
limit 0,1;

## get 1 random banner
select idregistry
into @bannerid
from organizationregistry 
where idorganization = in_idorganization 
and havebanner = 1
order by rand()
limit 0,1;

update organizationparty
set havefood = 1
where idregistry = @foodid;

update organizationparty
set havebanner = 1
where idregistry = @bannerid;


drop temporary table temp_registrys;
drop temporary table temp_partynames;

end
$$
delimiter ;

##call populatepartyregistrys(1);
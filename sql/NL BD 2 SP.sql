USE `nl`;

##############################################################
#						LOGIN
##############################################################

DROP procedure IF EXISTS `verifyLogin`;
DELIMITER $$
CREATE PROCEDURE `verifyLogin`(
	in_username varchar(50),
	in_password varchar(128)
)
BEGIN	
    SELECT password, salt
    into @password, @salt
	from login
	where username = in_username;
	
	if sha1(concat(@salt,in_password)) = @password then
	
		select idlogin, username,displayname, hascommanderTag, isAdmin
        from login
        where username = in_username
        and enddate > now();
	else
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid username/password ';
	end if;
END$$
DELIMITER ;


##############################################################
##						USER
##############################################################

DROP procedure IF EXISTS `changeLoginPassword`;
DELIMITER $$
CREATE PROCEDURE `changeLoginPassword` (
in_idlogin int,
in_password varchar(128)
)
BEGIN
	Update `login`
    Set `password` = sha1(concat(salt,in_password)),
		updatedDate = NOW()
    WHERE idlogin = in_idlogin;
END
$$
DELIMITER ;

DROP procedure IF EXISTS `changeUserProfile`;
DELIMITER $$  
CREATE PROCEDURE changeUserProfile(
	in_idlogin int,
    in_displayname varchar(50),
    in_hascommanderTag tinyint,
    in_professions varchar(255),
    in_split varchar(1)
)
BEGIN
	
    delete from loginprofession
    where idlogin = in_idlogin;
    
	SET @String      = in_professions;
	SET @Occurrences = LENGTH(@String) - LENGTH(REPLACE(@String, in_split, ''));
	myloop: WHILE (@Occurrences > 0)
	DO 
		SET @myValue = SUBSTRING_INDEX(@String, ',', 1);
		IF (@myValue != '') THEN
		
			set @in_profession = cast(@myvalue as unsigned int);
			
			insert into loginprofession 
			values (in_idlogin,@in_profession);
			
		ELSE
			LEAVE myloop; 
		END IF;
		SET @Occurrences = LENGTH(@String) - LENGTH(REPLACE(@String, in_split, ''));
		IF (@occurrences = 0) THEN 
			LEAVE myloop; 
		END IF;
		SET @String = SUBSTRING(@String,LENGTH(SUBSTRING_INDEX(@String, in_split, 1))+2);
	END WHILE; 
    
    update login
    set displayname = in_displayname,
		hascommanderTag = in_hascommanderTag,
        updateddate = NOW()
	where idlogin = in_idlogin;
    
END $$
DELIMITER ;

DROP procedure IF EXISTS `getUserProfile`;
DELIMITER $$
CREATE PROCEDURE `getUserProfile` (
	in_idlogin INT
)
BEGIN
	select l.displayname, l.hascommanderTag
    from login l 
    where l.idlogin = in_idlogin;

SELECT p.name, count(l.idlogin)  as active 
 FROM loginProfession l
	right JOIN profession p
    ON l.idprofession = p.idprofession 
    and l.idlogin = in_idlogin         
    where p.active = 1
    group by p.name
    order by p.idprofession;
END
$$
DELIMITER ;

##############################################################
##						PROFESSION
##############################################################



DROP procedure IF EXISTS `getAllProfessions`;
DELIMITER $$
CREATE PROCEDURE `getAllProfessions` ()
BEGIN
SELECT *
 FROM profession p 
 where p.active = 1
 order by p.idprofession;
END
$$
DELIMITER ;


##############################################################
##						ACCOUNT
##############################################################


DROP procedure IF EXISTS `getAccount`;
DELIMITER $$
CREATE PROCEDURE `getAccount` (
	in_idlogin INT
)
BEGIN
    SELECT idlogin, username, displayname, 
			hascommanderTag, isAdmin, createddate, updateddate, enddate
	from login
	where idlogin = in_idlogin;
END
$$
DELIMITER ;



DROP procedure IF EXISTS `createAccount`;
DELIMITER $$
CREATE PROCEDURE `createAccount` (
in_username varchar(50),
in_password varchar(128),
in_displayname varchar(50),
in_salt varchar(128),
in_hascommanderTag tinyint,
in_isAdmin tinyint
)
BEGIN
	INSERT INTO `login`(`username`,`password`,`salt`,`displayname`,`hascommanderTag`,`isAdmin`,`createddate`,`updateddate`,`enddate`)
	VALUES (in_username,
		    in_password,
            in_salt,
            in_displayname,
            in_hascommanderTag,
			in_isAdmin,
			NOW(),
			NOW(),
			'9999-12-31 23:59:59');
END
$$
DELIMITER ;



DROP procedure IF EXISTS `updateAccount`;
DELIMITER $$
CREATE PROCEDURE `updateAccount` (
	in_idlogin int,
	in_username varchar(50),
	in_displayname varchar(50),
	in_hascommanderTag tinyint,
	in_isAdmin tinyint,
	in_delete tinyint
)
BEGIN
	Update `login`
    Set isAdmin = in_isAdmin,
		username = in_username,
		displayname = in_displayname,
		hascommanderTag = in_hascommanderTag,
		updateddate = NOW(),
        enddate = CASE WHEN in_delete = 1 THEN NOW() ELSE '9999-12-31 23:59:59' END
    WHERE idlogin = in_idlogin;
END
$$
DELIMITER ;

##############################################################
##						Organization
##############################################################


DROP procedure IF EXISTS `createOrganization`;
DELIMITER $$
CREATE PROCEDURE `createOrganization` (
in_idpartyconfiguration int,
in_title varchar(50)
)
BEGIN
	INSERT INTO `organization`(`idstatus`,`idpartyconfiguration`,`title`,`createddate`,`updateddate`,`enddate`)
	VALUES (1,
		    in_idpartyconfiguration,
            in_title,           
			NOW(),
			NOW(),
			'9999-12-31 23:59:59');
            
	SELECT LAST_INSERT_ID();
END
$$
DELIMITER ;

DROP procedure IF EXISTS `getOrganization`;
DELIMITER $$
CREATE PROCEDURE `getOrganization` (
in_idorganization INT
)
BEGIN
	select idstatus into @mystatus
    from organization 
    where idorganization = in_idorganization;

    SELECT o.idorganization, 
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
		CALL getActivePartyConfiguration();
    
    elseif @mystatus in (2,3) then
        CALL getRegistrys(in_idorganization); 
        CALL getStatistics(in_idorganization);
	elseif @mystatus in(4,5,6) then
		CALL getPartys(in_idorganization);
        CALL getStatistics(in_idorganization);
	end if;  
    
    
END
$$
DELIMITER ;

DROP procedure IF EXISTS `getOrganizationStatus`;
DELIMITER $$
CREATE PROCEDURE `getOrganizationStatus` (
in_idorganization INT
)
BEGIN
	select idorganization,idstatus
    from organization
    where idorganization = in_idorganization;
END
$$
DELIMITER ;

DROP procedure IF EXISTS `getOrganizationForUser`;
DELIMITER $$
CREATE PROCEDURE `getOrganizationForUser` (
	in_idorganization INT,
    in_idlogin int
)
BEGIN
	CALL getUserOrganizationConfiguration(in_idorganization,in_idlogin);
   
   select idstatus into @mystatus
    from organization 
    where idorganization = in_idorganization;

    SELECT o.idorganization, 
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
		CALL getActivePartyConfiguration();    
    elseif @mystatus in (2,3) then
        CALL getRegistrys(in_idorganization); 
        CALL getStatistics(in_idorganization);
	elseif @mystatus in (4) then
		CALL getRegistrys(in_idorganization); 
        CALL getPartys(in_idorganization);
        CALL getStatistics(in_idorganization);
	elseif @mystatus in(5,6) then
		CALL getPartys(in_idorganization);
        CALL getStatistics(in_idorganization);
	end if;  
    
END
$$
DELIMITER ;


DROP procedure IF EXISTS `getStatistics`;
DELIMITER $$
CREATE PROCEDURE `GetStatistics` (
	in_idorganization int
)
BEGIN
     SELECT p.idprofession, p.name, count(a.idregistry)  as value 
    FROM organizationregistry a 
	right JOIN profession p ON a.idprofession = p.idprofession
    where a.idorganization = in_idorganization and p.active = 1
    group by p.name;
   
END
$$
DELIMITER ;

DROP procedure IF EXISTS `updateOrganization`;
DELIMITER $$
CREATE PROCEDURE `updateOrganization` (
in_idorganization int,
in_title varchar(255),
in_idpartyconfiguration int
)
BEGIN
    update organization
    set title = in_title,
		idpartyconfiguration = in_idpartyconfiguration,
		updateddate = now()
	where idorganization = in_idorganization;    
END
$$
DELIMITER ;


DROP procedure IF EXISTS `moveStatusOrganization`;
DELIMITER $$
CREATE PROCEDURE `moveStatusOrganization` (
in_idorganization int,
in_idstatus int
)
BEGIN
	set @idstatus = in_idstatus +1;
    
    update organization
    set idstatus = @idstatus,
		updateddate = now(),
        enddate = CASE WHEN @idstatus = 5 THEN NOW() ELSE '9999-12-31 23:59:59' END
	where idorganization = in_idorganization;    
    
END
$$
DELIMITER ;

DROP procedure IF EXISTS `resetOrganization`;
DELIMITER $$
CREATE PROCEDURE `resetOrganization` (
	in_idorganization int
)
BEGIN
	delete from organizationparty
    where idorganization = in_idorganization;
    
    delete from organizationregistry
    where idorganization = in_idorganization;

    update organization
    set idstatus = 1,
		updateddate = now(),
        enddate = '9999-12-31 23:59:59'
	where idorganization = in_idorganization;    
END
$$
DELIMITER ;

DROP procedure IF EXISTS `getRegistrys`;
DELIMITER $$
CREATE PROCEDURE `getRegistrys` (
	in_idorganization int
)
BEGIN
	SELECT l.username
		  ,l.displayname
		  ,p.name as profession
		  ,r.havebanner
		  ,r.havefood
		  ,r.haveTag
	FROM organizationregistry r 
	inner join login l
	on r.idlogin = l.idlogin
	inner join profession p 
	on r.idprofession = p.idprofession
	where r.idorganization = in_idorganization
	order by idregistry;
END
$$
DELIMITER ;

DROP procedure IF EXISTS `getRegistrysForPartys`;
DELIMITER $$
CREATE PROCEDURE `getRegistrysForPartys` (
	in_idorganization int
)
BEGIN
	SELECT r.idregistry,
		   p.idprofession
	FROM organizationregistry r 
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
END
$$
DELIMITER ;


DROP procedure IF EXISTS `getPartys`;
DELIMITER $$
CREATE PROCEDURE `getPartys` (
	in_idorganization int
)
BEGIN
	SELECT p.name as partyname
	  ,l.username
	  ,l.displayname
	  ,prof.name as profession
	  ,o.havebanner
	  ,o.havefood
	  ,r.haveTag
	FROM organizationparty o 
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
END
$$
DELIMITER ;

DROP procedure IF EXISTS `cleanPartys`;
DELIMITER $$
CREATE PROCEDURE `cleanPartys` (
	in_idorganization int
)
BEGIN
    delete from organizationparty
    where idorganization = in_idorganization;

    update organization
    set updateddate = now()        
	where idorganization = in_idorganization;    
END
$$
DELIMITER ;

DROP procedure IF EXISTS `getActiveOrganizations`;
DELIMITER $$
CREATE PROCEDURE `getActiveOrganizations` (
	in_idlogin int
)
BEGIN
	SELECT distinct o.idorganization, o.title, p.description as configuration, p.jsviewname, o.idstatus, s.description, case when r.idlogin  is not null then 1 else 0 end userInOrganization
	FROM organization o inner join status s
    on o.idstatus = s.idstatus
    inner join partyconfiguration p 
    on o.idpartyconfiguration = p.idpartyconfiguration
    left join organizationregistry r 
    on o.idorganization = r.idorganization  and r.idlogin = in_idlogin
    where o.idstatus in (2,3,4,5)
	order by o.idorganization;
END
$$
DELIMITER ;


DROP procedure IF EXISTS `getUserOrganizationConfiguration`;
DELIMITER $$
CREATE PROCEDURE `getUserOrganizationConfiguration` (
	in_idorganization INT,
    in_idlogin INT
)
BEGIN
	select o.idorganization,
		   o.idstatus,
		   l.username,
		   l.displayname,
		   o.title,
		   pc.description,
		   case when pc.pickcommander = 1 THEN l.hascommanderTag else 0 end pickcommander,
		   pc.pickbanner, 
		   pc.pickfood       
	from organization o inner join partyconfiguration pc
	on o.idpartyconfiguration = pc.idpartyconfiguration 
	cross join login l 
	where o.idorganization = in_idorganization
	and l.idlogin = in_idlogin;
    
	SELECT p.name, p.idprofession
	FROM login l
    inner join loginProfession lp
    on l.idlogin = lp.idlogin
	inner JOIN profession p
    on lp.idprofession = p.idprofession 
    and p.active = 1 
	where l.idlogin = in_idlogin
	order by p.idprofession;    
    
    select r.idregistry,r.idorganization,r.idprofession, p.name,r.havefood,r.havebanner,r.haveTag
    from organizationregistry r inner join profession p 
    on r.idprofession = p.idprofession
    where r.idorganization = in_idorganization
    and r.idlogin = in_idlogin;
    
END
$$
DELIMITER ;


DROP procedure IF EXISTS `addOrganizationUser`;
DELIMITER $$
CREATE PROCEDURE `addOrganizationUser` (
in_idorganization int,
in_idlogin int,
in_idprofession int,
in_havefood tinyint,
in_havebanner tinyint,
in_haveTag varchar(10)
)
BEGIN
	select count(idregistry), idregistry
	into @count, @idregistry
	from organizationregistry
    where idorganization = in_idorganization
    and idlogin = in_idlogin;
    
    if @count = 0 then
		insert into organizationregistry (`idorganization`, `idlogin`, `idprofession`, `havefood`, `havebanner`, `haveTag`, `createddate`, `updateddate`) 
		values(
			in_idorganization,
			in_idlogin,
			in_idprofession,
			in_havefood,
			in_havebanner,
			in_haveTag,
			NOW(),
			NOW()
		);
    else
		update organizationregistry
		set idprofession = in_idprofession,
			havefood = in_havefood,
			havebanner = in_havebanner,
			haveTag = in_haveTag,
			updateddate = NOW()
		where idregistry = @idregistry
		and idorganization = in_idorganization
		and idlogin = in_idlogin;
    
    end if;

END
$$
DELIMITER ;

##############################################################
##						Party Configuration
##############################################################
DROP procedure IF EXISTS `getActivePartyConfiguration`;
DELIMITER $$
CREATE PROCEDURE `getActivePartyConfiguration` ()
BEGIN
    SELECT idpartyconfiguration, description,jsviewname 
,pickfood 
,pickbanner 
,pickcommander
	from partyconfiguration
	where enddate = '9999-12-31 23:59:59';
END
$$
DELIMITER ;

DROP procedure IF EXISTS `createConfiguration`;
DELIMITER $$
CREATE PROCEDURE `createConfiguration` (
 in_description varchar(255),
 in_jsviewname varchar(255),
 in_pickbanner tinyint,
 in_pickfood tinyint,
 in_pickcommander tinyint
)
BEGIN
  INSERT INTO `partyconfiguration`
(`description`,
`jsviewname`,
`pickfood`,
`pickbanner`,
`pickcommander`,
`createddate`,
`updateddate`,
`enddate`)
VALUES
(in_description,
in_jsviewname,
in_pickfood,
in_pickbanner,
in_pickcommander,
NOW(),
NOW(),
'9999-12-31 23:59:59');

set @idpartyconfiguration = LAST_INSERT_ID();
insert into partyconfigurationprofession (idpartyconfiguration,idprofession,rank,makeExtraGroup,groupName,createddate,updateddate)
select @idpartyconfiguration, idprofession, -1, 0, '', NOW(),NOW() 
from profession;


select @idpartyconfiguration;

END
$$
DELIMITER ;



DROP procedure IF EXISTS `getConfiguration`;
DELIMITER $$
CREATE PROCEDURE `getConfiguration` (
in_idpartyconfiguration int
)
BEGIN
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
    makeExtraGroup, 
    groupName, 
    createddate, 
    updateddate
    from partyconfigurationprofession 
    where idpartyconfiguration = in_idpartyconfiguration;
END
$$
DELIMITER ;

DROP procedure IF EXISTS `saveConfiguration`;
DELIMITER $$
CREATE PROCEDURE `saveConfiguration` (
in_idpartyconfiguration int,
in_description varchar(255), 
in_jsviewname varchar(255) ,
in_pickbanner tinyint(4), 
in_pickfood tinyint(4) ,
in_pickcommander tinyint(4)
)
BEGIN
    update partyconfiguration
    set description = in_description,
		jsviewname = in_jsviewname,
		pickfood = in_pickfood,
        pickbanner = in_pickbanner,
        pickcommander = in_pickcommander,
        updateddate = NOW()
	where idpartyconfiguration = in_idpartyconfiguration;    
END
$$
DELIMITER ;


DROP procedure IF EXISTS `saveConfigurationProfession`;
DELIMITER $$
CREATE PROCEDURE `saveConfigurationProfession` (
in_idpartyconfigurationprofession int,
in_rank int 
)
BEGIN
    update partyconfigurationprofession
    set rank = in_rank,		
        updateddate = NOW()
	where idpartyconfigurationprofession = in_idpartyconfigurationprofession;    
END
$$
DELIMITER ;

##############################################################
##						TESTING PURPOSES
##############################################################
DROP procedure IF EXISTS `populatePartyRegistrys`;
DELIMITER $$
CREATE PROCEDURE `populatePartyRegistrys` (
	in_idorganization int
)
BEGIN

delete from organizationRegistry 
where idorganization = in_idorganization;

set @idorga = in_idorganization;
set @rand = CEIL((RAND() * (select count(1) from login) ));
set @sql = 'insert into organizationregistry (`idorganization`, `idlogin`, `idprofession`, `havefood`, `havebanner`, `haveTag`, `createddate`, `updateddate`) select ?, idlogin, (select idprofession from profession where active = 1 ORDER BY RAND() LIMIT 1) as idprofession , ROUND(RAND()) havefood, ROUND(RAND()) havebanner,'''' ,NOW(), NOW() from login where idlogin > CEIL((RAND() * (select count(1) from login) )) order by rand() limit ?';

PREPARE stmt FROM @sql;
EXECUTE stmt USING @idorga, @rand;
DEALLOCATE PREPARE stmt;

END
$$
DELIMITER ;

DROP procedure IF EXISTS `makeOrganizationPartys`;
DELIMITER $$
CREATE PROCEDURE `makeOrganizationPartys` (
	in_idorganization int,
    in_groupSize int
)
BEGIN

delete from organizationparty 
where idorganization = in_idorganization;

## Get how many groups we will have
select CEIL((select count(idregistry) from organizationregistry where idorganization = in_idorganization)  / in_groupSize) as count
into @count;

## get random partynames for the number of groups we have
DROP temporary table  IF EXISTS temp_partynames;
create temporary table temp_partynames ( id int not null primary key AUTO_INCREMENT, idpartyname int not null);
insert into temp_partynames (idpartyname)
	select idpartyname from partyname order by rand();

delete from temp_partynames
where id > @count +1;


## get all the registration by the rank configuration
DROP temporary table  IF EXISTS temp_registrys;
create temporary table temp_registrys ( id int not null primary key AUTO_INCREMENT, idregistry int not null, idprofession int not null);
insert into temp_registrys (idregistry,idprofession)
	SELECT r.idregistry,
		   p.idprofession
	FROM organizationregistry r 
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
	select in_idorganization, p.idpartyname , r.idregistry ,0 ,0, NOW()
	from temp_registrys r , temp_partynames p 
	where r.id % @count +1 = p.id
	order by p.id;

## get 1 random food
select idregistry
into @foodid
from organizationregistry 
where idorganization = in_idorganization 
and havefood = 1
order by RAND()
limit 0,1;

## get 1 random banner
select idregistry
into @bannerid
from organizationregistry 
where idorganization = in_idorganization 
and havebanner = 1
order by RAND()
limit 0,1;

update organizationparty
set havefood = 1
where idregistry = @foodid;

update organizationparty
set havebanner = 1
where idregistry = @bannerid;


drop temporary table temp_registrys;
drop temporary table temp_partynames;

END
$$
DELIMITER ;

##Call populatePartyRegistrys(1);
-- phpMyAdmin SQL Dump
-- version 4.0.10.10
-- http://www.phpmyadmin.net
--
-- Host: 127.11.205.2:3306
-- Generation Time: Oct 20, 2015 at 07:52 AM
-- Server version: 5.5.45
-- PHP Version: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET GLOBAL time_zone = "+05:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `orga`
--
DROP DATABASE IF EXISTS `orga`;
CREATE DATABASE IF NOT EXISTS `orga` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `orga`;

DELIMITER $$
--
-- Procedures
--
CREATE PROCEDURE `addorganizationuser`(
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

end$$

CREATE PROCEDURE `changeloginpassword`(
in_idlogin int,
in_password varchar(128)
)
begin
	update `login`
    set `password` = sha1(concat(salt,in_password)),
		updateddate = now()
    where idlogin = in_idlogin;
end$$

CREATE PROCEDURE `changeuserprofile`(
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
    
end$$

CREATE PROCEDURE `cleanpartys`(
	in_idorganization int
)
begin
    delete from organizationparty
    where idorganization = in_idorganization;

    update organization
    set updateddate = now()        
	where idorganization = in_idorganization;    
end$$

CREATE PROCEDURE `createaccount`(
in_username varchar(50),
in_password varchar(128),
in_displayname varchar(50),
in_salt varchar(128),
in_hascommandertag tinyint,
in_idrole int
)
begin
	insert into `login`(`username`,`password`,`salt`,`displayname`,`hascommandertag`,`idrole`,`createddate`,`updateddate`,`enddate`)
	values (in_username,
		    sha1(concat(in_salt,in_password)),
            in_salt,
            in_displayname,
            in_hascommandertag,
			in_idrole,
			now(),
			now(),
			NULL);
end$$

CREATE PROCEDURE `createconfiguration`(
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

end$$

CREATE PROCEDURE `createorganization`(
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
end$$

CREATE PROCEDURE `getaccount`(
	in_idlogin int
)
begin
    select idlogin, username, displayname, 
			hascommandertag, idrole, createddate, updateddate, enddate
	from login
	where idlogin = in_idlogin;
end$$

CREATE PROCEDURE `getactiveorganizations`(
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
end$$

CREATE PROCEDURE `getactivepartyconfiguration`()
begin
    select idpartyconfiguration, description,jsviewname 
,pickfood 
,pickbanner 
,pickcommander
	from partyconfiguration
	where enddate IS NULL;
end$$

CREATE PROCEDURE `getallprofessions`()
begin
select *
 from profession p 
 where p.active = 1
 order by p.idprofession;
end$$

CREATE PROCEDURE `getconfiguration`(
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
end$$

CREATE PROCEDURE `getorganization`(
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
    
    
end$$

CREATE PROCEDURE `getorganizationforuser`(
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
	end if;
end$$

CREATE PROCEDURE `getorganizationstatus`(
in_idorganization int
)
begin
	select idorganization,idstatus
    from organization
    where idorganization = in_idorganization;
end$$

CREATE PROCEDURE `getparticipation`(in_startdate varchar(10),in_enddate varchar(10))
begin
	set @in_startdate = date(in_startdate);
	set @in_enddate = date(in_enddate );

	select l.username, l.displayname, count(r.idorganization) participation, date(min(r.createddate)),date(max(r.createddate))
	from organization o 
    inner join organizationregistry r 
    on o.idorganization = r.idorganization
	inner join login l 
	on r.idlogin = l.idlogin
	where o.idstatus = 6
    and r.createddate >= @in_startdate
	and r.createddate < @in_enddate
	group by l.username, l.displayname
	order by l.username, l.displayname, r.createddate;
end$$

CREATE PROCEDURE `getpartys`(
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
end$$

CREATE PROCEDURE `getregistrys`(
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
end$$

CREATE PROCEDURE `getregistrysforpartys`(
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
end$$

CREATE PROCEDURE `getroles`()
begin
	select idrole,description
    from role
    where active = 1;
end$$

CREATE PROCEDURE `getstatistics`(
	in_idorganization int
)
begin
     select p.idprofession, p.name, count(a.idregistry)  as value 
    from organizationregistry a 
	right join profession p on a.idprofession = p.idprofession
    where a.idorganization = in_idorganization and p.active = 1
    group by p.name;
   
end$$

CREATE PROCEDURE `getuserorganizationconfiguration`(
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
    
end$$

CREATE PROCEDURE `getuserprofile`(
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
end$$

CREATE PROCEDURE `makeorganizationpartys`(
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

end$$

CREATE PROCEDURE `movestatusorganization`(
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
    
end$$

CREATE PROCEDURE `populatepartyregistrys`(
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

end$$

CREATE PROCEDURE `resetorganization`(
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
end$$

CREATE PROCEDURE `saveconfiguration`(
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
end$$

CREATE PROCEDURE `saveconfigurationprofession`(
in_idpartyconfigurationprofession int,
in_rank int 
)
begin
    update partyconfigurationprofession
    set rank = in_rank,		
        updateddate = now()
	where idpartyconfigurationprofession = in_idpartyconfigurationprofession;    
end$$

CREATE PROCEDURE `updateaccount`(
	in_idlogin int,
	in_username varchar(50),
	in_displayname varchar(50),
	in_hascommandertag tinyint,
	in_idrole int,
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
end$$

CREATE PROCEDURE `updateorganization`(
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
end$$

CREATE PROCEDURE `verifylogin`(
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

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE IF NOT EXISTS `login` (
  `idlogin` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(128) NOT NULL,
  `displayname` varchar(50) NOT NULL,
  `salt` varchar(128) NOT NULL,
  `hascommandertag` tinyint(4) NOT NULL,
  `idrole` int(11) NOT NULL,
  `createddate` datetime NOT NULL,
  `updateddate` datetime NOT NULL,
  `enddate` datetime DEFAULT NULL,
  PRIMARY KEY (`idlogin`),
  UNIQUE KEY `uk_username_displayname` (`username`,`displayname`)
);

--
-- Truncate table before insert `login`
--

TRUNCATE TABLE `login`;
--
-- Dumping data for table `login`
--

INSERT INTO `login` (`username`, `password`, `displayname`, `salt`, `hascommandertag`, `idrole`, `createddate`, `updateddate`, `enddate`) VALUES
('admin', '7d91e543fc13fd4b1208a5f6ae1a3607b6dff981', 'admin', '1659a98e4168a34a4c9d77a9cc0b5f7103f48bce', 0, 4, '2015-10-18 17:59:43', '2015-10-19 16:21:44', NULL),
('Aedh.7290', 'dcae8f4a891a62f72939e9c901fd5155a3b71a36', 'Aedh.7290', '517801ff3ce228ed102a2bcdac2fe2fd49f295f7528ffbb94b36be85816389aa267bedc2f6c8fedcc50ed34d1c223785730e2a8887a5821d5a65674d5cc2f785', 0, 1, '2015-10-19 10:57:46', '2015-10-19 10:57:46', NULL),
('Akeronian.6574', 'e1b814067c3b252eee3c53a9dd3bf292e6e9dd68', 'Akeronian.6574', 'e4878797a1f61d35428363e90d62e404cc967ea5e43e9de1d129049c567e18f0bf3fb0d64e691f564b68d797ad27e1df128a72901b28f4c9e9715ccaf3fd19ec', 0, 1, '2015-10-19 10:57:55', '2015-10-19 10:57:55', NULL),
('Applelotte.8467', 'b228a1655762eb4e8313c419ff44263b27f9027b', 'Applelotte.8467', '12bda605a6271e0a5059298507a78191fe0a0b965c2f5036700d7e9adc817a781ddfd979e8d7ae47e0e59799e857367392fa6348be586ef1d71fa9ea1d5105d4', 0, 1, '2015-10-19 10:58:06', '2015-10-19 10:58:06', NULL),
('Cheerful George.3960', '40059f75e228a651037252f45f122e51e53c5e5b', 'Cheerful George.3960', '514c1b62cb9d667993423fade697c55a8ebaee035e18e812a387ad64bb11c15223580c355fa0f7de17e0b8dcffbd83a09aecd59a6ac2bef47f0e3243999b6e18', 0, 1, '2015-10-19 10:58:15', '2015-10-19 10:58:15', NULL),
('Crow.1583', '7a4cbcc0de50eba7f1b56db1e99784b560d681ad', 'Crow.1583', '65ffcbbd8c895fed57028e769cecc5f79f8ca7c1dad8379622568872b76925bc59f1af981decdbe49769f5da548e103f05b359a84574c9a3489a1cfc3534980d', 0, 1, '2015-10-19 10:58:25', '2015-10-19 10:58:25', NULL),
('cyrromatic.4821', '4317a602024608684673dab37401cdd7238d369a', 'cyrromatic.4821', 'a3e33fc52cd29b5075689f1b82ceaf7c9ebe3c1d6d0c10fdb0218addb58c0c40d097daede9523e848dbf4144e48ba7edf6b7f51c61eacd485fcc67a61cc4e1ec', 0, 1, '2015-10-19 10:58:35', '2015-10-19 10:58:35', NULL),
('Dark Dodder.8126 ', '654b15993f0e89eec240ce40d6a2ecb66e52a248', 'Dark Dodder.8126', '9e24e181eb6c651a4fa2a4869bc11b7c2a27f0dc60ef41e126e9109e4893aabba6d98293b528a338846b18ec6dad28b41f2e0366c131719b9ff26a48d63f1a40', 0, 1, '2015-10-19 10:58:46', '2015-10-19 10:58:46', NULL),
('DefEnter.4217', '09b861d60b31711c7a8952049022e3c54265352c', 'DefEnter.4217', '095ed531b5b61faa0f1c96897c2032d39382f4f0998bd9bd6a709208692ee1faea8319e8ff9ed9bca5c0827c5aa6b9d37f22fb5bfc335d4f92a067517bd9cdb8', 0, 1, '2015-10-19 10:58:55', '2015-10-19 10:58:55', NULL),
('DeWinter.8175', '0745a887bafe3e3dcbdb5079260f3460b3080ee1', 'DeWinter.8175', '46b7172827605a061bac01ad0e9f9fa1b87231e93f61ae62ed723a2516c1d5f853b63edd8dd7592892f6d1fa2ac5075afc8055bd3826cea7d30056e81743aee1', 0, 1, '2015-10-19 10:59:04', '2015-10-19 10:59:04', NULL),
('DuSundar.7085', '9f855b65e82ac35e583272f897600ae0b363474c', 'DuSundar.7085', '016913173a4966bab98a94f47fa69d43fc8edd301f2f3b56f954fa25808bf8161aee276ae3b110270d846a7b3911173242a1abe2e715485b180f6d775012657b', 0, 1, '2015-10-19 10:59:13', '2015-10-19 10:59:13', NULL),
('Elmfruit.3721', 'c4b51386e2c6bc878844ab1f9a3d64bad5dbc3d3', 'Elmfruit.3721', '621f8d5de407dd17c929adfee2d1857c9331e47958067fafa497a629ca4b318de1171a394c8c9d07086cac96a4fbad728ed97b53756224ce5255340f095603ec', 0, 1, '2015-10-19 10:59:21', '2015-10-19 10:59:21', NULL),
('Elyssaria.3624', 'f78163581dce49a282efb4488d6592f103e2bcfe', 'Elyssaria.3624', '7f2f49ec5cc2cea77a90e0f4376de2cd0ae5a4c2deef52ada86c6bf77f5f46d713645d57ac962410e6b0b63b2176d8b716154f94291254bed50b4dc49d520ea6', 0, 1, '2015-10-19 10:59:30', '2015-10-19 10:59:30', NULL),
('Fajeth.4291', 'a98501f63bca6665c08be036e3ecb94eb8ffb889', 'Fajeth.4291', '1212fcacd91ced5a7e2f3173d80042b2fdd663f2c3ac4737699428f7e0fc0d4818aca06a781127c0333cf0f17927ba572cfe6ea61585eac60f472a3b25042fe4', 0, 1, '2015-10-19 10:59:38', '2015-10-19 10:59:38', NULL),
('Fowidner.6930', '049df4a438b4a7589b194ee3164aa18a7d0274f5', 'Fowidner.6930', '28eddb1ec25ef609f777265eb9cd910f558a7d64cdbc7fa729ec2c69b695f2ea18171758e5315cbc8d2a1263e13978837350ed51f635270df30843cb0d557b6e', 0, 1, '2015-10-19 10:59:46', '2015-10-19 10:59:46', NULL),
('FoxVanilla.9682', 'b429bf7a048e8032675feb1c854bc54efc8ae006', 'FoxVanilla.9682', '26a9641eaf34763a026974d3624733e5c6261ff463f36f1d290017f5fd705eb384380f699799c86610383eee89d79bd072aafdf672b6a705e4e46d9561ea1bab', 0, 1, '2015-10-19 10:59:55', '2015-10-19 10:59:55', NULL),
('Fresho.6870', '22b14e46492736fe3da90fa01646ddc65eba3919', 'Fresho.6870', '0cb784f0269da14af3a59049d8cb821f0bb1a1a04d9f183cae5dbb0b717d681549bc8e750f9e4780d096c7b53a78c1ea88359c50e9f8b4c198f578d251f3b335', 0, 1, '2015-10-19 11:00:04', '2015-10-19 11:00:04', NULL),
('Gamiraude.6214', 'c9c21ffc4ca754c3e9793c20fe65f7282a204482', 'Gamiraude.6214', '23c4cbc9b3781fdf319de6891586eff49ad0fda5e6d41d523ca81e668f812dc3ab47921147341035e769764614653eb329cb15e91465fe3816f03a1e9e9ca4c4', 0, 1, '2015-10-19 11:00:15', '2015-10-19 11:00:15', NULL),
('Immortal.3647', '79709e0de5d9200e988eacccf1e445b794fcd1b5', 'Immortal.3647 ', '40ada4a485f6fefca11653139e4e196052365ec0a440f309fef45efbda42552a94a402e6c80bd5643ccbd160f64d8dac1bb7bde6683266ecacf6e7221d141a7e', 0, 1, '2015-10-19 11:00:24', '2015-10-19 11:00:24', NULL),
('Isparia.1472', 'd541f9669928975d1a53add3b0501f9c96834e51', 'Isparia.1472', 'd281e5419b6ef8a285194128f6b4538f44616baed27dcb6aa687729a97d079bf93a0d68e14a38589cdb058a188eab839896bed25967f60829f29f1ef366b8429', 0, 1, '2015-10-19 11:00:33', '2015-10-19 11:00:33', NULL),
('Jemface.4230', '14c94c51b0c89b97d758da5a86e6b4311e783ff5', 'Jemface.4230 ', 'd1f86bb4ba83427cfd950b5ac8fe96e80a6166df528b2acc39e38335a7d24602131f9516d58d802aff5c2eed7757d87e83d22303a1136e2e4acb9f043602d511', 0, 1, '2015-10-19 11:00:41', '2015-10-19 11:00:41', NULL),
('KRISSZ.3078', '36db3c845723cb6f98f75580d7ebdf6b7699139e', 'KRISSZ.3078', '86d82669e15f67564d7b9734cfe35259a80b626347e4daf8c343f9b7050e9a46b0afe7cac10f25402089f4bc7b945a42ba3f2899738583c524a55325b1a943da', 0, 1, '2015-10-19 11:00:50', '2015-10-19 11:00:50', NULL),
('Luna.2039', '49f5ab42f7c13231909dd4b1a4e409e7f315f7e7', 'Luna.2039', '2643bf7dd77ce2e440305a7fa9e373c90861c87ad39eb339c2f8dc3386f2db6c53ef800237354de018c9591cfa43002d42271903b7a5ba4b283abdb61048914c', 0, 1, '2015-10-19 11:01:00', '2015-10-19 11:01:00', NULL),
('Mariulo.2019', '221f77c58910d40cca1b1fdf003f04e67f73888e', 'Mariulo.2019', '16cd3622777faf34aeee1b396c4e903bee9e69315fabbf95ed5687922911db4be7dd7c0c0fb1de9db6e7c2c0d2a50d39f32eb3a0110ff07124291165d9bf61e6', 0, 1, '2015-10-19 11:01:09', '2015-10-19 11:01:09', NULL),
('monts.2189', '3016794fd0af342a0a8e5ab1cc78ebd813046347', 'monts.2189', '45e9fb991a98c120e6c9a950c0241aae6161172944206676eb23f14f50a2e85a75eed48ad721a3ab58aeff6e8695310e38a35264e46eacd2dcfa1bb62d027e2f', 0, 1, '2015-10-19 11:01:18', '2015-10-19 11:01:18', NULL),
('Patinka.1906', '14854b8685f5313d364797595e26f50b24cae87b', 'Patinka.1906', '1620d9a6fed994909b023c42e8c6c3d52fb0aa10e0ff390681b0d90cf4a2d8774c9780201fc3921cba2af3f08aa23ba470d99988a5ab3e332bc28f79a06f4932', 0, 1, '2015-10-19 11:01:28', '2015-10-19 11:01:28', NULL),
('Reaper Of Death.7840', '0758ebd79dd02c40db7ffb27fd65903f0af02bdb', 'Reaper Of Death.7840', 'ff0e91609af7ed090ee8303905a79f9f1e18cd824ec2e60aa111d72921815b99cf11e5786f0022e45ab29a649846448d4fa8a2db7117faeb4c26ad54f2eee116', 0, 1, '2015-10-19 11:01:36', '2015-10-19 11:01:36', NULL),
('samuwel.6501', '32f4be234b3ca72bf398e96edda256a9160ea329', 'samuwel.6501', 'ff7153b1f6e5a3fd26702fc8b0cafcb41ea66fe7ae9eed72bd221929d4704e4d89b4715dd04c76c60b1263afad1b976fde0cb0528193823359981efd1547b3bd', 0, 1, '2015-10-19 11:01:45', '2015-10-19 11:01:45', NULL),
('Sekuso Trez.8345', '57cae0d5e89cf8947f63be604fa52c22e96d4a9e', 'Sekuso Trez.8345', '740002cf6fd5533313cf535fa56fbdb916ff7253d1d81d2173d6618a2c822362766ca16c582c78559254b39002a37c5b2c72afe735229bdea0c42d09acce02b9', 0, 1, '2015-10-19 11:01:54', '2015-10-19 11:01:54', NULL),
('Sepp Der Depp.3175', '456eab9a244bee7b04c8b1f063046c02a6ab77ca', 'Sepp Der Depp.3175', 'd5620331701c621d309ca7a31c6df5b09abc3305e86b049f32ddd9b04ea4c807b8d4011c0ea62952b2ab35bf10df861da36abe4226c7dab51f9db8a87da65044', 0, 1, '2015-10-19 11:02:04', '2015-10-19 11:02:04', NULL),
('ShadowAssasin.5127', '3391f1dd7d7bced8928f4c659b074c52e44672ba', 'ShadowAssasin.5127', '9f7645a17d4300a94e7f88275c5bb907c68c4f60c260ae8a94b5fcfa31afc3a935c6bfef1583c3bf0809f6a72def3a09750b0695c99dc789cbc787ea9ca57194', 0, 1, '2015-10-19 11:02:12', '2015-10-19 11:02:12', NULL),
('Shishi Echo Malum.9635', 'a330a4d371378131b2379dc5edb3cea0a788fdd6', 'Shishi Echo Malum.9635', '387121816b75a447b927bdc8247c2e095a7ab78926656dbcc14478c0e2a0b60c3d9c81e912fab8c249ff9fb3b8dfe092c61030010bcee8a52de4019de196bb67', 0, 1, '2015-10-19 11:02:25', '2015-10-19 11:02:25', NULL),
('Sign.5643', '10f788242ddff7f2559bd291a338f3bb84109d72', 'Sign.5643', '63ec6755ec100329502ecc1da52387ebb672e4bea50dd11aab797390250654820ee52f61ad04d9e162eaf7e937dca7a7c5c9f6857af1260dc5edf4fbe09616e9', 0, 1, '2015-10-19 11:02:35', '2015-10-19 11:02:35', NULL),
('Skylark.5849', '342a667ccf1bc2b0a010e300a0d7c13643d0f731', 'Skylark.5849', '0135d746f2de3d0dca765bc132c11df68eed55accc1e2ac5f844308b60110c11933dd2e848edf91a6b0e0217d5d25525a0d0212e202a1553523f9f7e70bfb943', 0, 1, '2015-10-19 11:02:43', '2015-10-19 11:02:43', NULL),
('Sonnilon.2143', '453dc5e07271cd7a8f7215332565f1f17a72877d', 'Sonnilon.2143', '73b7d38a6814cc774ddb3b4d4a9494c7337fc975a5c4ef4e770ec248ffbae522a6b23c23b435a58f020cfab1c0886226d2754f7ed8db22de8d450abefdb3fc2c', 0, 1, '2015-10-19 11:02:51', '2015-10-19 11:02:51', NULL),
('splifa.1372', '91e0af02318e50d5d50f1f7d3fcaae0056239edd', 'splifa.1372', '6081ce73e4a36b9c40bb8efe12703aef80f782ccedfdc00ff9ed7ec1e98ef64d0657d5e09b435b27c156ce1ac86b8bb0d635362fe33ac827225c7b719fc5a51d', 0, 1, '2015-10-19 11:03:01', '2015-10-19 11:03:01', NULL),
('Syaniia.3074', '0cf4522b284aece07e6e333d0302061936c2ecc6', 'Syaniia.3074', 'e1bce69a837f06506ee45a4848426b3ff786b7b9e2c795a005dc53422d6e1374df7ad5c7afcfbb59427bc21f1d059825613345582a590fb88dab2d25ff272187', 0, 1, '2015-10-19 11:03:10', '2015-10-19 11:03:10', NULL),
('TemporalMind.7845', 'ca76d498c7c1d353d0f101188d155e8097e79e0d', 'TemporalMind.7845', '41ff23d216335d54d49e39619307f7e39be41d9c50926c22311c5525300993c59e5386313462d06a6379cb5b4dbdbf761fbe4dd0cff70c2dd044cbd246e1cf95', 0, 2, '2015-10-19 11:03:20', '2015-10-19 11:03:20', NULL),
('TheCrow.5306', 'd4cfe0857a80ca5d96e7c952023703f87638c182', 'TheCrow.5306', '2ed6e2967fe97af7b6e107b75d5d6035e43146c75c23902fe6f6a9e69049f75444699bb1011e385c2e52e73c0ee0683d051c3a2862be20e41f807c7643bf7c6b', 0, 1, '2015-10-19 11:03:29', '2015-10-19 11:03:29', NULL),
('timmetje.9310', '1fdf03e3b67c423e005f592c38d98e491c8a7619', 'timmetje.9310', '1fae327132b33e0a33c275330532637701d8c4abc35c9d73f4af9ac624d521872444cd611d01e51941a7869d76248fd5bc6e746f43c4ac94af3b84bd9e431cbe', 0, 1, '2015-10-19 11:03:37', '2015-10-19 11:03:37', NULL),
('Tipsy Queen.9831', '459a47995d3347169545aa86e5aab43cfc3c3259', 'Tipsy Queen.9831', '430138527f74cab38141bdf36471ab6b38d5e111ea752b660f7bb0537c8a7bb705510353da14a6477e670390277bf9d12aeef9fd9557292a9a1bc9c842c7b4ad', 0, 1, '2015-10-19 11:03:47', '2015-10-19 11:03:47', NULL),
('tmetz.8205', '2bc9b4412aaefaa0d559af60d42d00145ecbc2f4', 'tmetz.8205', 'da501947747e65056377d7cf7152a2d788aa6ccbc3a61a10a22b90a415ce85aaff4d5ffd869deb44fbbcb94f16f182d9dfb945a07963fb67bd43ef4524055af3', 0, 1, '2015-10-19 11:03:55', '2015-10-19 11:03:55', NULL),
('Vladanmit.4052', '031339284a91aa34aa4278b7f5686093cc2116b2', 'Vladanmit.4052', 'c5192c326f1005988e1b9e57d2f235521549a823f4bcbc1a35e07a9271e71859a8f425e0f7bbfb29eb9d5587bac2b135a0ad78f8115c58e4cb0332d0b395a343', 0, 1, '2015-10-19 11:04:04', '2015-10-19 11:04:04', NULL),
('WcPate.2079', 'b18706b6c000be573a4e223780c1f56780b03177', 'WcPate.2079', 'a9b252879339a2aa45c190a65ca0018a1ca8826f8055710750b7cf13e86560caf2a566d3e56ed0d64749c273534602f775b2fba606c62404ee926469fde0078b', 0, 1, '2015-10-19 11:04:22', '2015-10-19 11:04:22', NULL),
('Xnyle.2964', '4a506af559b69f2847a004d52260aa09a69cb5fc', 'Xnyle.2964', '1a12d5d61ba1e3c4ec5743faaba58e7cd2f1f777553773c5954e09dd179ad2abb13dbe6e72f4b0996b1e66638ef4a16515b7849ea14305a7d80dc71fa202ec29', 0, 1, '2015-10-19 11:04:34', '2015-10-19 11:04:34', NULL),
('YummyCarrot.8940', 'e8336e5e6604ac7e0bbf11484c85eb689c337989', 'YummyCarrot.8940', '78695a6152bd0b4bb755eec6b0619209fbc68db4a9519a1b19b5b2cfaa156393d0bf55030c64f25d2f2edb6ddc90f642004bef4ea19ab17e006cd86e7d50f81f', 0, 1, '2015-10-19 11:04:42', '2015-10-19 11:04:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `loginprofession`
--

CREATE TABLE IF NOT EXISTS `loginprofession` (
  `idlogin` int(11) NOT NULL,
  `idprofession` int(11) NOT NULL,
  PRIMARY KEY (`idlogin`,`idprofession`)
);

--
-- Truncate table before insert `loginprofession`
--

TRUNCATE TABLE `loginprofession`;
--
-- Dumping data for table `loginprofession`
--

INSERT INTO `loginprofession` (`idlogin`, `idprofession`) VALUES
(1, 1),
(1, 5),
(1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE IF NOT EXISTS `organization` (
  `idorganization` int(11) NOT NULL AUTO_INCREMENT,
  `idpartyconfiguration` int(11) NOT NULL,
  `idstatus` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `createddate` datetime NOT NULL,
  `updateddate` datetime NOT NULL,
  `enddate` datetime DEFAULT NULL,
  PRIMARY KEY (`idorganization`)
);

--
-- Truncate table before insert `organization`
--

TRUNCATE TABLE `organization`;
--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`idpartyconfiguration`, `idstatus`, `title`, `createddate`, `updateddate`, `enddate`) VALUES
(1, 2, '19-10-15', '2015-10-19 16:20:51', '2015-10-19 16:23:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `organizationparty`
--

CREATE TABLE IF NOT EXISTS `organizationparty` (
  `idorganizationparty` int(11) NOT NULL AUTO_INCREMENT,
  `idorganization` int(11) NOT NULL,
  `idpartyname` int(11) NOT NULL,
  `idregistry` int(11) NOT NULL,
  `havefood` tinyint(4) NOT NULL,
  `havebanner` tinyint(4) NOT NULL,
  `createddate` datetime NOT NULL,
  PRIMARY KEY (`idorganizationparty`),
  KEY `fk_organizationparty_organization` (`idorganization`),
  KEY `fk_organizationparty_organizationregistry` (`idregistry`)
);

--
-- Truncate table before insert `organizationparty`
--

TRUNCATE TABLE `organizationparty`;
-- --------------------------------------------------------

--
-- Table structure for table `organizationregistry`
--

CREATE TABLE IF NOT EXISTS `organizationregistry` (
  `idregistry` int(11) NOT NULL AUTO_INCREMENT,
  `idorganization` int(11) NOT NULL,
  `idlogin` int(11) NOT NULL,
  `idprofession` int(11) NOT NULL,
  `havefood` tinyint(4) NOT NULL,
  `havebanner` tinyint(4) NOT NULL,
  `havetag` varchar(10) NOT NULL,
  `createddate` datetime NOT NULL,
  `updateddate` datetime NOT NULL,
  PRIMARY KEY (`idregistry`),
  UNIQUE KEY `uc_idorganization_idlogin` (`idorganization`,`idlogin`),
  KEY `fk_organizationregistry_login` (`idlogin`)
);

--
-- Truncate table before insert `organizationregistry`
--

TRUNCATE TABLE `organizationregistry`;
--
-- Dumping data for table `organizationregistry`
--

INSERT INTO `organizationregistry` (`idorganization`, `idlogin`, `idprofession`, `havefood`, `havebanner`, `havetag`, `createddate`, `updateddate`) VALUES
(1, 1, 1, 1, 1, '', '2015-10-19 16:23:49', '2015-10-19 16:23:49');

-- --------------------------------------------------------

--
-- Table structure for table `partyconfiguration`
--

CREATE TABLE IF NOT EXISTS `partyconfiguration` (
  `idpartyconfiguration` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `jsviewname` varchar(255) NOT NULL,
  `pickfood` tinyint(4) NOT NULL,
  `pickbanner` tinyint(4) NOT NULL,
  `pickcommander` tinyint(4) NOT NULL,
  `createddate` datetime NOT NULL,
  `updateddate` datetime NOT NULL,
  `enddate` datetime DEFAULT NULL,
  PRIMARY KEY (`idpartyconfiguration`)
);

--
-- Truncate table before insert `partyconfiguration`
--

TRUNCATE TABLE `partyconfiguration`;
--
-- Dumping data for table `partyconfiguration`
--

INSERT INTO `partyconfiguration` (`description`, `jsviewname`, `pickfood`, `pickbanner`, `pickcommander`, `createddate`, `updateddate`, `enddate`) VALUES
('Tequat''l - Zerg Only', 'OrganizationPartyTeqZerg', 1, 1, 0, '2015-10-12 15:47:37', '2015-10-12 19:49:23', NULL),
('Tequat''l - Defense + Zerg', 'OrganizationPartyTeqDefZerg', 1, 1, 0, '2015-10-12 15:47:37', '2015-10-12 15:47:37', NULL),
('GM Bounty - 2 Targets', 'OrganizationPartyBounty2', 0, 0, 0, '2015-10-12 15:47:37', '2015-10-12 15:47:37', NULL),
('GM Bounty - 3 Targets', 'OrganizationPartyBounty3', 0, 0, 0, '2015-10-12 15:47:37', '2015-10-12 15:47:37', NULL),
('GM Bounty - 6 Targets', 'OrganizationPartyBounty6', 0, 0, 0, '2015-10-12 15:47:37', '2015-10-12 15:47:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `partyconfigurationprofession`
--

CREATE TABLE IF NOT EXISTS `partyconfigurationprofession` (
  `idpartyconfigurationprofession` int(11) NOT NULL AUTO_INCREMENT,
  `idpartyconfiguration` int(11) NOT NULL,
  `idprofession` int(11) NOT NULL,
  `rank` int(11) NOT NULL,
  `makeextragroup` tinyint(4) NOT NULL,
  `groupname` varchar(30) DEFAULT NULL,
  `createddate` datetime NOT NULL,
  `updateddate` datetime NOT NULL,
  PRIMARY KEY (`idpartyconfigurationprofession`),
  KEY `fk_partyconfigurationprofession_profession` (`idprofession`),
  KEY `fk_partyconfigurationprofession_partyconfiguration` (`idpartyconfiguration`)
);

--
-- Truncate table before insert `partyconfigurationprofession`
--

TRUNCATE TABLE `partyconfigurationprofession`;
--
-- Dumping data for table `partyconfigurationprofession`
--

INSERT INTO `partyconfigurationprofession` (`idpartyconfiguration`, `idprofession`, `rank`, `makeextragroup`, `groupname`, `createddate`, `updateddate`) VALUES
(1, 1, 1, 1, 'Wall #', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 2, 2, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 3, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 4, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 5, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 6, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 7, 3, 1, 'Swirling Winds #', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 8, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
(1, 9, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 1, 1, 1, 'Wall #', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 2, 2, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 3, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 4, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 5, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 6, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 7, 3, 1, 'Swirling Winds #', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 8, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 2, 9, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 1, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 2, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 3, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 4, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 5, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 6, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 7, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 8, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 3, 9, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 1, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 2, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 3, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 4, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 5, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 6, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 7, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 8, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 4, 9, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 1, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 2, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 3, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 4, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 5, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 6, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 7, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 8, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37'),
( 5, 9, 99, 0, '', '2015-10-12 15:47:37', '2015-10-12 15:47:37');

-- --------------------------------------------------------

--
-- Table structure for table `partyname`
--

CREATE TABLE IF NOT EXISTS `partyname` (
  `idpartyname` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`idpartyname`)
);

--
-- Truncate table before insert `partyname`
--

TRUNCATE TABLE `partyname`;
--
-- Dumping data for table `partyname`
--

INSERT INTO `partyname` (`name`) VALUES
('Vekk''s Krewe'),
('Dwayna''s Communion'),
('Grenth''s Communion'),
('Team Twilight'),
('Golem Gang'),
('Sunless Coalition'),
('Legendary League'),
('Team Agony'),
('Agony Assembly'),
( 'Primordus Partnership'),
( 'Skritt Corps'),
( 'Torment Horde'),
( 'Tyrian Brigade'),
( 'Jennah''s Clique'),
( 'Orr Corps'),
( 'Destiny''s Union'),
( 'Celestial Squad'),
( 'Club Tagachi'),
( 'Afflicted Horde'),
( 'Destroyer Institute'),
( 'Lion''s Pride'),
( 'Team Thorn'),
( 'Club Scarlet'),
( 'Mists Pack'),
( 'Mystic Fellowship'),
( 'Ectoplasmic Cluster'),
( 'Weyandt''s Crew'),
( 'Skritt Pack'),
( 'Club Karka'),
( 'Team Togo'),
( 'House Quaggan'),
( 'Karmic Coalition'),
( 'Fractal Fellowship'),
( 'Aurora Asssembly'),
( 'Artesian Association'),
( 'Risen Horde'),
( 'Doric''s Fellowship'),
( 'Platinum Posse'),
( 'Ascended Assembly'),
( 'Team WupWup'),
( 'Team Syzygy'),
( 'Team Soros'),
( 'Team Angchu'),
( 'Team Ventari'),
( 'Team Occam'),
( 'Team Sunless'),
( 'Team Zealot'),
( 'Team Rubicon'),
( 'Team Saphir'),
( 'Team Ferratus'),
( 'Team Augur'),
( 'Team Tethyos'),
( 'Team Jurah'),
( 'Team Snowflake'),
( 'Team Celestial'),
( 'Team Flamekissed'),
( 'Team Zodiac'),
( 'Team Hellfire'),
( 'Team Trickster'),
( 'Team Apostle'),
( 'Team Cooguloosh'),
( 'Team Eidolon'),
( 'Team FluxMatrix'),
( 'Team Enchiridion'),
( 'Team Volcanus'),
( 'Team Llama'),
( 'Team Sam'),
( 'Team Yakkington'),
( 'Team Keiran'),
( 'Team Apples'),
( 'Team Kormir'),
( 'Team Sunspears'),
( 'Team Sunrise'),
( 'Team Eternity'),
( 'Team Bifrost');

-- --------------------------------------------------------

--
-- Table structure for table `profession`
--

CREATE TABLE IF NOT EXISTS `profession` (
  `idprofession` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `active` tinyint(4) NOT NULL,
  PRIMARY KEY (`idprofession`)
);

--
-- Truncate table before insert `profession`
--

TRUNCATE TABLE `profession`;
--
-- Dumping data for table `profession`
--

INSERT INTO `profession` (`name`, `active`) VALUES
('guardian', 1),
('warrior', 1),
('revenant', 0),
('ranger', 1),
('thief', 1),
('engineer', 1),
('elementalist', 1),
('mesmer', 1),
('necromancer', 1);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `idrole` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  `active` tinyint(4) NOT NULL,
  PRIMARY KEY (`idrole`)
);

--
-- Truncate table before insert `role`
--

TRUNCATE TABLE `role`;
--
-- Dumping data for table `role`
--

INSERT INTO `role` (`description`, `active`) VALUES
('Guild Member', 1),
('Commander', 1),
('Administrator', 1),
('Super Administrator', 0);

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
  `idstatus` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(50) NOT NULL,
  PRIMARY KEY (`idstatus`)
);

--
-- Truncate table before insert `status`
--

TRUNCATE TABLE `status`;
--
-- Dumping data for table `status`
--

INSERT INTO `status` (`idstatus`, `description`) VALUES
(1, 'Change Data'),
(2, 'Start Party Registry'),
(3, 'Stop Party Registry'),
(4, 'Make Partys'),
(5, 'Show Partys'),
(6, 'Ended');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `organizationparty`
--
ALTER TABLE `organizationparty`
  ADD CONSTRAINT `fk_organizationparty_organization` FOREIGN KEY (`idorganization`) REFERENCES `organization` (`idorganization`),
  ADD CONSTRAINT `fk_organizationparty_organizationregistry` FOREIGN KEY (`idregistry`) REFERENCES `organizationregistry` (`idregistry`);

--
-- Constraints for table `organizationregistry`
--
ALTER TABLE `organizationregistry`
  ADD CONSTRAINT `fk_organizationregistry_login` FOREIGN KEY (`idlogin`) REFERENCES `login` (`idlogin`),
  ADD CONSTRAINT `fk_organizationregistry_organization` FOREIGN KEY (`idorganization`) REFERENCES `organization` (`idorganization`);

--
-- Constraints for table `partyconfigurationprofession`
--
ALTER TABLE `partyconfigurationprofession`
  ADD CONSTRAINT `fk_partyconfigurationprofession_partyconfiguration` FOREIGN KEY (`idpartyconfiguration`) REFERENCES `partyconfiguration` (`idpartyconfiguration`),
  ADD CONSTRAINT `fk_partyconfigurationprofession_profession` FOREIGN KEY (`idprofession`) REFERENCES `profession` (`idprofession`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

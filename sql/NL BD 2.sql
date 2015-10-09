drop schema if exists `nl`;
create schema `nl`;
use `nl`;
/*********************************************/
/* 					tables	 			 	 */
/*********************************************/


create table `status` (
  `idstatus` int not null auto_increment ,
  `description` varchar(50) not null ,
  primary key (`idstatus`)  );

/*********************************************/
/* 					partyname 			 	 */
/*********************************************/
drop table if exists `partyname`;
create table `partyname` (
  `idpartyname` int not null auto_increment ,
  `name` varchar(200) not null ,
  primary key (`idpartyname`)  );

/*********************************************/
/* 					profession 			 	 */
/*********************************************/
drop table if exists `profession`;
create table `profession` (
  `idprofession` int not null auto_increment ,
  `name` varchar(50) not null ,
  `active` tinyint not null,
  primary key (`idprofession`)  );

drop table if exists `role`;
create table `role` (
  `idrole` int not null auto_increment ,
  `description` varchar(50) not null,
  `active` tinyint not null,
  primary key (`idrole`)  );

/*********************************************/
/* 					login    			 	                 */
/*********************************************/  
drop table if exists `login`;
create table `login` (
  `idlogin` int not null auto_increment ,
  `username` varchar(50) not null ,
  `password` varchar(128) not null,
  `displayname` varchar(50) not null ,
  `salt` varchar(128) not null,
  `hascommandertag` tinyint not null,
  `idrole` int not null,
  `createddate` datetime not null,
  `updateddate` datetime not null,
  `enddate` datetime null,
  primary key (`idlogin`)  ,
  unique key `uk_username_displayname`(`username`, `displayname`)
  );

alter table `login` add constraint `fk_login_role` foreign key (`idrole`)
references role (`idrole`);   

/*********************************************/
/* 			    loginprofession    		 	 */
/*********************************************/  
drop table if exists `loginprofession`;  
  create table `loginprofession` (
    `idlogin` int not null, 
    `idprofession` int not null,
    
    primary key (`idlogin`,`idprofession`) 
);
/*alter table `loginprofession` add constraint `fk_loginprofession_login` foreign key (idlogin)
   references login (idlogin);   
alter table `loginprofession` add constraint `fk_loginprofession_profession` foreign key (idprofession)
    references profession (idprofession);  
*/

/*********************************************/
/*		    organizationconfiguration    	 */
/*********************************************/  
drop table if exists `partyconfiguration`;
create table `partyconfiguration` (
  `idpartyconfiguration` int not null auto_increment ,
  `description` varchar(255) not null ,
  `jsviewname` varchar(255) not null ,
  `pickfood` tinyint not null,
  `pickbanner` tinyint not null,
  `pickcommander` tinyint not null,
  `createddate` datetime not null,
  `updateddate` datetime not null,
  `enddate`  datetime null,
  primary key (`idpartyconfiguration`)  );


/*********************************************/
/* 			    organization    		 	 */
/*********************************************/  
drop table if exists `organization`;
create table `organization` (
  `idorganization` int not null auto_increment,
  `idpartyconfiguration` int not null,
  `idstatus` int not null,
  `title` varchar(255),
  `createddate` datetime not null,
  `updateddate` datetime not null,  
  `enddate`  datetime null,
  primary key (`idorganization`)  ); 

/*alter table `organization` add constraint `fk_organization_status` foreign key (idstatus)
    references status (idstatus);    

alter table `organization` add constraint `fk_organization_partyconfiguration` foreign key (idpartyconfiguration)
    references partyconfiguration (idpartyconfiguration);    
*/
/*********************************************/
/* 			    organizationregistry     	 */
/*********************************************/  
drop table if exists `organizationregistry`;
create table `organizationregistry` (
  `idregistry` int not null auto_increment ,
  `idorganization` int not null ,
  `idlogin` int not null ,
  `idprofession` int not null ,
  `havefood` tinyint not null,
  `havebanner` tinyint not null,
  `havetag` varchar(10) not null,
  `createddate` datetime not null ,
  `updateddate` datetime not null ,
  primary key (`idregistry`) ,
  constraint uc_idorganization_idlogin unique (idorganization,idlogin));

alter table `organizationregistry` add constraint `fk_organizationregistry_organization` foreign key (idorganization)
   references organization (idorganization);
   
alter table `organizationregistry` add constraint `fk_organizationregistry_login` foreign key (idlogin)
   references login (idlogin);
/*alter table `organizationregistry` add constraint `fk_organizationregistry_profession` foreign key (idprofession)
    references profession (idprofession);  */

/*********************************************/
/* 			    organizationparty	     	 */
/*********************************************/  
drop table if exists `organizationparty`;
create table `organizationparty` (
  `idorganizationparty` int not null auto_increment ,
  `idorganization` int not null ,
  `idpartyname` int not null ,
  `idregistry` int not null ,
  `havefood` tinyint not null,
  `havebanner` tinyint not null,
  `createddate` datetime not null ,
  primary key (`idorganizationparty`) );  
alter table `organizationparty` add constraint `fk_organizationparty_organization` foreign key (idorganization)
   references organization (idorganization); 
alter table `organizationparty` add constraint `fk_organizationparty_organizationregistry` foreign key (idregistry)
   references organizationregistry (idregistry);      

/*********************************************/
/*		    partyconfigurationprofession   	 */
/*********************************************/    
drop table if exists `partyconfigurationprofession`;
create table `partyconfigurationprofession` (
  `idpartyconfigurationprofession` int not null auto_increment ,
  `idpartyconfiguration` int not null,
  `idprofession` int not null  ,
  `rank` int not null,
  `makeextragroup` tinyint not null,
  `groupname` varchar(30),
  `createddate` datetime not null,
  `updateddate` datetime not null,
  primary key (`idpartyconfigurationprofession`)  );  

alter table `partyconfigurationprofession` add constraint `fk_partyconfigurationprofession_profession` foreign key (idprofession)
    references profession (idprofession);   
alter table `partyconfigurationprofession` add constraint `fk_partyconfigurationprofession_partyconfiguration` foreign key (idpartyconfiguration)
    references partyconfiguration (idpartyconfiguration);
    


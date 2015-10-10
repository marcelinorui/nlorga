DROP SCHEMA IF exists `nl`;
CREATE SCHEMA `nl`;
USE `nl`;
/*********************************************/
/* 					Tables	 			 	 */
/*********************************************/


CREATE TABLE `status` (
  `idstatus` INT NOT NULL AUTO_INCREMENT ,
  `description` varchar(50) NOT NULL ,
  PRIMARY KEY (`idstatus`)  );

/*********************************************/
/* 					PARTYNAME 			 	 */
/*********************************************/
DROP TABLE IF EXISTS `partyname`;
CREATE TABLE `partyname` (
  `idpartyname` INT NOT NULL AUTO_INCREMENT ,
  `name` varchar(200) NOT NULL ,
  PRIMARY KEY (`idpartyname`)  );

/*********************************************/
/* 					PROFESSION 			 	 */
/*********************************************/
DROP TABLE IF EXISTS `profession`;
CREATE TABLE `profession` (
  `idprofession` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(50) NOT NULL ,
  `active` tinyint not null,
  PRIMARY KEY (`idprofession`)  );


/*********************************************/
/* 					ROLE    			 	 */
/*********************************************/  
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
	`idrole` INT NOT NULL AUTO_INCREMENT,
    `description` varchar(100) not null,
    PRIMARY KEY (`idrole`)
);

/*********************************************/
/* 					LOGIN    			 	 */
/*********************************************/  
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `idlogin` INT NOT NULL AUTO_INCREMENT ,
  `username` varchar(50) NOT NULL ,
  `password` varchar(128) not null,
  `displayname` varchar(50) NOT NULL ,
  `salt` varchar(128) not null,
  `hascommanderTag` tinyint not null,
  `isAdmin` tinyint not null,
  `createddate` datetime not null,
  `updateddate` datetime not null,
  `enddate` datetime not null,
  PRIMARY KEY (`idlogin`)  ,
  UNIQUE KEY `uk_username_displayname`(`username`, `displayname`)
  );

/*********************************************/
/* 			    LOGINPROFESSION    		 	 */
/*********************************************/  
DROP TABLE IF EXISTS `loginProfession`;  
  CREATE TABLE `loginProfession` (
    `idlogin` INT NOT NULL, 
    `idprofession` INT NOT NULL,
    
    PRIMARY KEY (`idlogin`,`idprofession`) 
);
/*ALTER TABLE `loginProfession` ADD CONSTRAINT `fk_loginProfession_login` FOREIGN KEY (idlogin)
   REFERENCES login (idlogin);   
ALTER TABLE `loginProfession` ADD CONSTRAINT `fk_loginProfession_profession` FOREIGN KEY (idprofession)
    REFERENCES profession (idprofession);  
*/

/*********************************************/
/*		    ORGANIZATIONCONFIGURATION    	 */
/*********************************************/  
DROP TABLE IF EXISTS `partyConfiguration`;
CREATE TABLE `partyConfiguration` (
  `idpartyconfiguration` INT NOT NULL AUTO_INCREMENT ,
  `description` varchar(255) NOT NULL ,
  `jsviewname` varchar(255) not null ,
  `pickfood` TINYINT NOT NULL,
  `pickbanner` TINYINT NOT NULL,
  `pickcommander` TINYINT NOT NULL,
  `createddate` datetime not null,
  `updateddate` datetime not null,
  `enddate`  datetime not null,
  PRIMARY KEY (`idpartyconfiguration`)  );


/*********************************************/
/* 			    ORGANIZATION    		 	 */
/*********************************************/  
DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization` (
  `idorganization` INT NOT NULL AUTO_INCREMENT,
  `idpartyconfiguration` INT NOT NULL,
  `idstatus` INT NOT NULL,
  `title` varchar(255),
  `createddate` datetime not null,
  `updateddate` datetime not null,  
  `enddate`  datetime not null,
  PRIMARY KEY (`idorganization`)  ); 

/*ALTER TABLE `organization` ADD CONSTRAINT `fk_organization_status` FOREIGN KEY (idstatus)
    REFERENCES status (idstatus);    

ALTER TABLE `organization` ADD CONSTRAINT `fk_organization_partyConfiguration` FOREIGN KEY (idpartyconfiguration)
    REFERENCES partyConfiguration (idpartyconfiguration);    
*/
/*********************************************/
/* 			    ORGANIZATIONREGISTRY     	 */
/*********************************************/  
DROP TABLE IF EXISTS `organizationRegistry`;
CREATE TABLE `organizationRegistry` (
  `idregistry` INT NOT NULL AUTO_INCREMENT ,
  `idorganization` INT NOT NULL ,
  `idlogin` INT NOT NULL ,
  `idprofession` INT NOT NULL ,
  `havefood` TINYINT NOT NULL,
  `havebanner` TINYINT NOT NULL,
  `haveTag` varchar(10) NOT NULL,
  `createddate` datetime NOT NULL ,
  `updateddate` datetime NOT NULL ,
  PRIMARY KEY (`idregistry`) ,
  CONSTRAINT uc_idorganization_idlogin UNIQUE (idorganization,idlogin));

ALTER TABLE `organizationRegistry` ADD CONSTRAINT `fk_organizationRegistry_organization` FOREIGN KEY (idorganization)
   REFERENCES organization (idorganization);
   
ALTER TABLE `organizationRegistry` ADD CONSTRAINT `fk_organizationRegistry_login` FOREIGN KEY (idlogin)
   REFERENCES login (idlogin);
/*ALTER TABLE `organizationRegistry` ADD CONSTRAINT `fk_organizationRegistry_profession` FOREIGN KEY (idprofession)
    REFERENCES profession (idprofession);  */

/*********************************************/
/* 			    ORGANIZATIONPARTY	     	 */
/*********************************************/  
DROP TABLE IF EXISTS `organizationParty`;
CREATE TABLE `organizationParty` (
  `idorganizationparty` INT NOT NULL AUTO_INCREMENT ,
  `idorganization` INT NOT NULL ,
  `idpartyname` INT NOT NULL ,
  `idregistry` int not null ,
  `havefood` tinyint not null,
  `havebanner` tinyint not null,
  `createddate` datetime NOT NULL ,
  PRIMARY KEY (`idorganizationparty`) );  
ALTER TABLE `organizationParty` ADD CONSTRAINT `fk_organizationParty_organization` FOREIGN KEY (idorganization)
   REFERENCES organization (idorganization); 
ALTER TABLE `organizationParty` ADD CONSTRAINT `fk_organizationParty_organizationRegistry` FOREIGN KEY (idregistry)
   REFERENCES organizationRegistry (idregistry);      

/*********************************************/
/*		    PARTYCONFIGURATIONPROFESSION   	 */
/*********************************************/    
DROP TABLE IF EXISTS `partyConfigurationProfession`;
CREATE TABLE `partyConfigurationProfession` (
  `idpartyconfigurationprofession` INT NOT NULL AUTO_INCREMENT ,
  `idpartyconfiguration` INT NOT NULL,
  `idprofession` INT NOT NULL  ,
  `rank` int not null,
  `makeExtraGroup` tinyint not null,
  `groupName` varchar(30),
  `createddate` datetime not null,
  `updateddate` datetime not null,
  PRIMARY KEY (`idpartyconfigurationprofession`)  );  

ALTER TABLE `partyConfigurationProfession` ADD CONSTRAINT `fk_partyConfigurationProfession_profession` FOREIGN KEY (idprofession)
    REFERENCES profession (idprofession);   
ALTER TABLE `partyConfigurationProfession` ADD CONSTRAINT `fk_partyConfigurationProfession_partyConfiguration` FOREIGN KEY (idpartyconfiguration)
    REFERENCES partyConfiguration (idpartyconfiguration);
    


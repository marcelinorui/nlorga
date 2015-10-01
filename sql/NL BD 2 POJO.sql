USE `nl`;

 DROP PROCEDURE IF EXISTS  `sp_create`;
 DELIMITER $$
 CREATE PROCEDURE `sp_create`(in_classname varchar(255))
 BEGIN
   DECLARE sp_name   VARCHAR(255);
   DECLARE sp_param  VARCHAR(255);
   DECLARE param  VARCHAR(4000);
   DECLARE jsparam  VARCHAR(4000);
   DECLARE js varchar(4000);
   
   DECLARE exit_sp_loop BOOLEAN;         
       
   -- Declare the cursor
   DECLARE sp_cursor CURSOR FOR
     SELECT distinct specific_name FROM  information_schema.PARAMETERS  where specific_schema = 'nl' and specific_name like concat('%',in_classname,'%');
   -- set exit_loop flag to true if there are no more rows
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_sp_loop = TRUE;
   
   CREATE TEMPORARY TABLE TBJS(js varchar(4000));
        
   -- open the cursor
   OPEN sp_cursor;
   -- start looping
   sp_loop: LOOP
     -- read the name from next row into the variables 
     FETCH  sp_cursor INTO sp_name;
     
     IF exit_sp_loop THEN
         CLOSE sp_cursor;
         LEAVE sp_loop;
     END IF;
     
     begin
		DECLARE exit_sp_parameters_loop BOOLEAN;  
        
        declare sp_parameters_cursor cursor for 
			select parameter_name from information_schema.PARAMETERS where specific_name = sp_name order by ordinal_position;
        
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_sp_parameters_loop = TRUE;
		
        OPEN sp_parameters_cursor;
			set js = '';
			set param = '';
			set jsparam = '';
			
			sp_parameters_loop: LOOP
			
			FETCH  sp_parameters_cursor INTO sp_param;
			IF exit_sp_parameters_loop THEN
				SET param = left(param,length(param)-1);
                SET jsparam = left(jsparam,length(jsparam)-1);
                CLOSE sp_parameters_cursor;
				LEAVE sp_parameters_loop;
			END IF;
			
			/*set js = concat(js,' ',replace(sp_param,'in_',''),case when exit_sp_parameters_loop then '' else ',' end);*/
			
			set jsparam = concat(jsparam, concat(' ',replace(sp_param,'in_',''),','));
			set param = concat(param, '?,');
        
        END LOOP sp_parameters_loop;
     end;
     
	 /*set js = concat(js,' ,callback){',char(13),char(10),' var sql = ''', sp_name, '(',param,')'';',char(13),char(10),'};');     */
     
     if instr(sp_name,'create') > 0 or instr(sp_name,'update') > 0 then
		set js = concat('			callback(err, "ok");',char(13),char(10));
	 elseif instr(sp_name,'validate') > 0 or instr(sp_name,'get') > 0 then
		set js = concat('			var out = self.getFields(rows,fields);',char(13),char(10),
        '			callback(err, out[0]);',char(13),char(10));
	 else
		set js = concat('			var out = self.getFields(rows,fields);',char(13),char(10),
        '			callback(err, out);',char(13),char(10));
     end if;
     
     insert into TBJS values (
		concat(in_classname,'.prototype.',sp_name,' = function(',jsparam,', callback){',char(13),char(10),
		'	//var self = this;',char(13),char(10),        
        '	var sql = ''CALL ',sp_name,'(',param,')'';',char(13),char(10),
        '	var params = [',jsparam,'];',char(13),char(10),
        '	var query = mysql.format(sql,params);',char(13),char(10),
        '	this.db.query(query, function (err, rows, fields) {',char(13),char(10),
        '		if (!err) {',char(13),char(10),
		js,
        '		} else {',char(13),char(10),
        '			callback(err,null);',char(13),char(10),
        '		}',char(13),char(10),
        '	});',char(13),char(10),
        '};',char(13),char(10)));
     
       
        
     -- check if the exit_loop flag has been set by mysql, 
     -- close the cursor and exit the loop if it has.
    
   END LOOP sp_loop;
   select distinct * from TBJS;
   
   drop table tbjs;
 END $$
 DELIMITER ;


call sp_create('Login');
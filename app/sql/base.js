var mysql = require('mysql');

function Base(db) {
    this.db = db;
};

Base.prototype.paginateQuery = function( table , columns , where , order , parameters, itemsPerPage, currentPage, callback ){
    if ( where ){ 
		where = ' WHERE 1 = 1 ' + where.join(' AND ');	
	}
	
	if ( !order ){
		order = ' ORDER BY 1 ASC'
	} else {
		order = 'ORDER BY ' + order.join(', ');
	}


    
    if (!columns){
        columns = '*';
    }
    

    
    if ( !parameters){
        parameters = [];
    }
    
    if (!currentPage){ currentPage = 1;}
    if (!itemsPerPage){ itemsPerPage = 10;}
    
    var startIndex = (currentPage-1)*itemsPerPage;
    var myFrom = ' FROM '+ '`'+table+'`' + where + order
    
    var queryParams = parameters;
    
    var querySql = '';
    if ( columns != '*' ){
        querySql = 'SELECT ' + '`'+columns.join('`, `') + '`' + myFrom + ' LIMIT ?,? ;'
    } else {
        querySql = 'SELECT ' + columns.join(', ')  + myFrom + ' LIMIT ?,? ;'
    }
    
    queryParams.push(startIndex);
    queryParams.push(itemsPerPage);
    
    var countSql = 'SELECT COUNT(1) '+ myFrom + ';';
    var countParams = parameters;
    
    var countQuery = mysql.format(countSql, countParams);
    var pageQuery = mysql.format(querySql, queryParams);    
    var self = this;
    this.db.query(countQuery + pageQuery, function (err, rows, fields) {
		if (!err) {
            var total = self.getSingle(rows,fields,0);
            var paginationData = {
                data: self.getTable(rows,fields,1),
                total : total,
                currentPage : currentPage,
                itemsPerPage: itemsPerPage,
                pageCount: Math.ceil(total/itemsPerPage),
            };
            return callback(err, paginationData);
        }
        return callback(err,null);
    });
};


Base.prototype.getFields = function (tables, fields) {
    return this.getTable(tables,fields,0);
};

Base.prototype.getFirstRow = function(tables, fields, idx){
    var pos = idx || 0;
    return this.getTable(tables,fields,pos)[0];
}

Base.prototype.getSingle = function(tables,fields, idx){
    var pos = idx || 0;
    return tables[pos][0][fields[pos][0].name]; 
};

Base.prototype.getTable = function (tables, fields, idx) {
    var pos = idx || 0;
    var out = [];
    for (var i = 0; i < tables[pos].length; i++) {
        var row = this.getRow(tables[pos][i],fields,pos);
        out.push(row);
    }    
    return out;
};

Base.prototype.getRow = function (row, fields,pos) {
    var rowObj = {};
    for (var f = 0; f < fields[pos].length; f++) {
        if (fields[pos][f].type == 1) { //TINYINT
            rowObj[fields[pos][f].name] = row[fields[pos][f].name] == 1 ? true : false;
        } else {
            rowObj[fields[pos][f].name] = row[fields[pos][f].name];
        }
    }
    return rowObj;
};
/*
Base.prototype.processGetFieldsJSON = function (sql, params, err, rows, fields, res) {
    if (!err) {
        var out = this.getFields(rows, fields);
        res.status(200).json(out);
        return;
    } else {
        this.processError(sql, params, err, rows, fields, res);
    }
};

Base.prototype.processGetFieldJSON = function (sql, params, err, rows, fields, res) {
    if (!err) {
        var out = this.getFields(rows, fields);
        res.status(200).json(out[0]);
    } else {
        this.processError(sql, params, err, rows, fields, res);
    }
};

Base.prototype.processPutJSON = function (sql, params, err, rows, fields, res) {
    if (!err) {
        var out = "ok";
        res.status(200).json(out);
    }
    else {
        this.processError(sql, params, err, rows, fields, res);
    }
};

Base.prototype.processErrorJSON = function (sql, params, err, rows, fields, res) {
    console.log('Error while performing Query.\r\n' + err);
    console.log('SQL ', JSON.stringify({ sql: sql, params: params }));
    res.status(500).json({ error: err });
}
*/

module.exports = Base;
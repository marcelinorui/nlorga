var mysql = require('mysql');

function Base(db) {
    this.db = db;
};

Base.prototype.paginateQuery = function (table, columns, where, order, parameters, itemsPerPage, currentPage, callback) {
    if (where) {
        where = ' WHERE 1 = 1 ' + where.join(' AND ');
    }

    if (!order) {
        order = ' ORDER BY 1 ASC'
    } else {
        order = 'ORDER BY ' + order.join(', ');
    }

    if (!columns) {
        columns = '*';
    }

    if (!parameters) {
        parameters = [];
    }

    if (!currentPage) { currentPage = 1; }
    if (!itemsPerPage) { itemsPerPage = 10; }
    else { itemsPerPage = parseInt(itemsPerPage, 10); }

    var startIndex = (currentPage - 1) * itemsPerPage;
    var myFrom = ' FROM ' + table + where + order

    var queryParams = parameters;

    var querySql = 'SELECT ' + columns.join(', ') + myFrom + ' LIMIT ?,? ;'
    queryParams.push(startIndex);
    queryParams.push(itemsPerPage);

    var countSql = 'SELECT COUNT(1) ' + myFrom + ';';
    var countParams = parameters;

    var countQuery = mysql.format(countSql, countParams);
    var pageQuery = mysql.format(querySql, queryParams);
    var self = this;
    this.db.query(countQuery + pageQuery, function (err, rows, fields) {
        if (!err) {
            var total = self.getSingle(rows, fields, 0);
            var paginationData = {
                data: self.getTable(rows, fields, 1),
                pager: {
                    total: total,
                    currentPage: currentPage,
                    itemsPerPage: itemsPerPage,
                    pageCount: Math.ceil(total / itemsPerPage)
                }
            };
            return callback(err, paginationData);
        }
        return callback(err, null);
    });
};

Base.prototype.getFields = function (tables, fields) {
    return this.getTable(tables, fields, 0);
};

Base.prototype.getFirstRow = function (tables, fields, idx) {
    var pos = idx || 0;
    return this.getTable(tables, fields, pos)[0];
}

Base.prototype.getSingle = function (tables, fields, idx) {
    var pos = idx || 0;
    return tables[pos][0][fields[pos][0].name];
};

Base.prototype.getTable = function (tables, fields, idx) {
    var pos = idx || 0;
    var out = [];
    for (var i = 0; i < tables[pos].length; i++) {
        var row = this.getRow(tables[pos][i], fields, pos);
        out.push(row);
    }
    return out;
};

Base.prototype.getTables = function (tables, fields) {
    var out = [];
    for (var i = 0; i < tables.length; i++) {
        var table = this.getTable(tables, fields, i);
        out.push(table);
    }
    return out;
};

Base.prototype.getRow = function (row, fields, pos) {
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

Base.prototype.executeQuerySingle = function(sql,params,callback){
	var query = mysql.format(sql,params);
    var self = this;
	this.db.query(query, function (err, rows, fields) {
        if(!err){
            var data = self.getSingle(rows,fields);
            callback(err,data);
        } else {
            callback(err,null);
        }  
    });
};

Base.prototype.executeQueryFirstRow = function(sql,params,callback){
	var query = mysql.format(sql,params);
    var self = this;
	this.db.query(query, function (err, rows, fields) {
        if(!err){
            var data = self.getFirstRow(rows,fields);
            callback(err,data);
        } else {
            callback(err,null);
        }  
    });
};

Base.prototype.executeQueryTables = function(sql,params,callback){
    var query = mysql.format(sql,params);
    var self = this;
	this.db.query(query, function (err, rows, fields) {
        if(!err){
            var data = self.getTables(rows,fields);
            callback(err,data);
        } else {
            callback(err,null);
        }  
    });
};

Base.prototype.executeQueryTable = function(sql,params,callback){
    var query = mysql.format(sql,params);
    var self = this;
	this.db.query(query, function (err, rows, fields) {
        if(!err){
            var data = self.getTable(rows,fields);
            callback(err,data);
        } else {
            callback(err,null);
        }  
    });
};

module.exports = Base;
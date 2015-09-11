
function Base(db) {
    this.db = db;
};

Base.prototype.getFields = function (rows, fields) {
    var out = [];
    for (var i = 0; i < rows[0].length; i++) {
        var obj = {};
        for (var f = 0; f < fields[0].length; f++) {
            if (fields[0][f].type == 1) { //TINYINT
                obj[fields[0][f].name] = rows[0][i][fields[0][f].name] == 1;
            } else {
                obj[fields[0][f].name] = rows[0][i][fields[0][f].name];
            }
        }
        out.push(obj);
    }
    return out;
};

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

module.exports = Base;
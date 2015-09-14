function routeControler(app, passport) {
    
    app.use('/', require('./base.js')(passport));	
    app.use('/user', require('./user.js')(passport));
    app.use('/admin', require('./admin.js')(passport));
    /*app.use('/api', require('./api.js')(passport));*/
}

module.exports = routeControler;
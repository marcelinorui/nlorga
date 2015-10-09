var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'NL Site - DEV',

    },
    ip: '127.0.0.1',
    port: 3000,
    db: {
      "username": "root",
      "password": "root",
      "database": "nl",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    cipher: {
      algorithm: 'aes-256-ctr',
      password: 'a very cool password for the cypher'
    }
  },
  test: {
    root: rootPath,
    app: {
      name: 'NL Site - TEST'
    },
    ip: process.env.OPENSHIFT_NODE_JS_IP,
    port: process.env.OPENSHIFT_NODEJS_PORT,
    db: {
      "username": process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      "password": process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
      "database": process.env.OPENSHIFT_MYSQL_DB_HOST,
      "host": process.env.OPENSHIFT_GEAR_NAME,
      "dialect": "mysql"
    },
    cipher: {
      algorithm: 'aes-256-ctr',
      password: 'a very cool password for the cypher'
    }
  },

  production: {
     root: rootPath,
    app: {
      name: 'NL Site'
    },
    ip: process.env.OPENSHIFT_NODEJS_IP,
    port: process.env.OPENSHIFT_NODEJS_PORT,
    db: {
      "username": process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      "password": process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
      "database": process.env.OPENSHIFT_MYSQL_DB_HOST,
      "host": process.env.OPENSHIFT_GEAR_NAME,
      "dialect": "mysql"
    },
    cipher: {
      algorithm: 'aes-256-ctr',
      password: 'a very cool password for the cypher'
    }
  }
};

module.exports = config[env];

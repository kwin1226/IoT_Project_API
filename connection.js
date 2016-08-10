var mysql = require('mysql');
 
function Connection() {
  this.pool = null;
 
  this.init = function(conf) {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: conf.db.mysql.host,
      user: conf.db.mysql.user,
      password: conf.db.mysql.password,
      database: conf.db.mysql.database
    });
  };
 
  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}
 
module.exports = new Connection();
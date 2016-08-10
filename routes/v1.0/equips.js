var connection = require('../../connection');
var debug = require('./debug/debug');

function EQUIPMENT() {
	
	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from Equipment', function(err, result) {
	      con.release();
	      res.send(result);
	    });
	  });
	};

	this.find = function(E_ID,res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from Equipment where E_ID = ? ',[E_ID], function(err, result) {
	      con.release();
	      res.send(result);
	    });
	  });
	};
	
	this.create = function(EQUIPMENT, res) {
	   var sql_data = {D_ID:EQUIPMENT.did, E_NAME:EQUIPMENT.equipName, E_MAKE_DAY:EQUIPMENT.equipPROD};
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into Equipment set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'Equipment creation failed'});
	       } else {
	         res.send({status: 0, message: 'Equipment successfully'});
	       }
	     });
	   });
	 };

	 this.update = function(EQUIPMENT, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {E_NAME:EQUIPMENT.equipName, D_ID:EQUIPMENT.did};
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update Equipment set ? where E_ID = ?', [sql_data, EQUIPMENT.eid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'Equipment update failed'});
	       } else {
	         res.send({status: 0, message: 'Equipment updated successfully'});
	       }
	     });
	   });
	 };

	 this.delete = function(E_ID, res) {
	     connection.acquire(function(err, con) {
	       con.query('delete from Equipment where E_ID = ?', [E_ID], function(err, result) {
	         con.release();
	         if (err) {
	           res.send({status: 1, message: 'Failed to delete'});
	         } else {
	           res.send({status: 0, message: 'Deleted successfully'});
	         }
	       });
	     });
	   };

}

module.exports = new EQUIPMENT();
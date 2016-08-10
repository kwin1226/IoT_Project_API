var connection = require('../../connection');
var debug = require('./debug/debug');

function SENS() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from SENSOR', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		sid:result[i].S_ID,
	      		eid:result[i].E_ID,
	      		sensorName:result[i].S_NAME
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT * FROM SENSOR WHERE E_ID = ? ',[id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		sid:result[i].S_ID,
	      		eid:result[i].E_ID,
	      		sensorName:result[i].S_NAME
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(SENS, res) {
	   var sql_data = {E_ID:SENS.eid, S_NAME:SENS.sensorName}
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into SENSOR set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'SENSOR creation failed'});
	       } else {
	         res.send({status: 0, message: 'SENSOR created successfully'});
	       }
	     });
	   });
	 };
	 this.update = function(SENS, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {E_ID:SENS.eid, S_NAME:SENS.sensorName}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update SENSOR set ? where S_ID = ?', [sql_data, SENS.sid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'SENSOR update failed'});
	       } else {
	         res.send({status: 0, message: 'SENSOR sid:'+ SENS.sid +'\nUpdated successfully'});
	       }
	     });
	   });
	 };
	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	     	console.log("刪除|| sid:" + id );
	       con.query('delete from SENSOR where S_ID = ?', [id], function(err, result) {
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
module.exports = new SENS();
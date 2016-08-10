var connection = require('../../connection');
var debug = require('./debug/debug');

function REGISTER() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from OpenProduct', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		eid:result[i].E_ID, 
	      		activitedTime:result[i].O_OPEN_TIME
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT C_ID, A.E_ID, D_ID, E_NAME, E_MAKE_DAY, O_OPEN_TIME FROM '+
	    		  '(SELECT * FROM Equipment WHERE E_ID IN (SELECT E_ID FROM OpenProduct WHERE C_ID = ?)) as A '+
	    		  'join (SELECT * FROM OpenProduct WHERE C_ID = ?) as B on A.E_ID = B.E_ID;', 
	    		  [id,id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		eid:result[i].E_ID, 
	      		did:result[i].D_ID,
	      		equipName:result[i].E_NAME, 
	      		equipPROD:result[i].E_MAKE_DAY, 
	      		activitedTime:result[i].O_OPEN_TIME
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(REGISTER, res) {
	   var sql_data = {C_ID:REGISTER.uid, E_ID:REGISTER.eid, O_OPEN_TIME:REGISTER.activitedTime}
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into OpenProduct set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'OpenProduct creation failed'});
	       } else {
	         res.send({status: 0, message: 'OpenProduct created successfully'});
	       }
	     });
	   });
	 };
	 this.update = function(REGISTER, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {C_ID:REGISTER.uid, E_ID:REGISTER.eid, O_OPEN_TIME:REGISTER.activitedTime}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update OpenProduct set ? where C_ID = ? AND E_ID = ?', [sql_data, REGISTER.uid, REGISTER.eid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'OpenProduct update failed'});
	       } else {
	         res.send({status: 0, message: 'OpenProduct uid:'+ REGISTER.uid+' eid:'+ REGISTER.eid +'\nUpdated successfully'});
	       }
	     });
	   });
	 };
	 this.delete = function(id1, id2, res) {
	     connection.acquire(function(err, con) {
	     	console.log("刪除|| uid:" + id1 + " eid:" + id2);
	       con.query('delete from OpenProduct where C_ID = ? AND E_ID = ?', [id1, id2], function(err, result) {
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
module.exports = new REGISTER();
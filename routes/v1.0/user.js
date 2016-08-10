var connection = require('../../connection');
var debug = require('./debug/debug');

function USER() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from CUSTOMER', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID,
	      		username:result[i].C_NAME,
	      		email:result[i].C_EMAIL,
	      		phone:result[i].C_PHONE
	      	};
	       data[data.length] = tmp; //新增新array
	      }
　			
	      res.send(JSON.stringify(data));
	      // res.send(result);
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from CUSTOMER where C_ID = ?', [id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		username:result[i].C_NAME, 
	      		email:result[i].C_EMAIL, 
	      		phone:result[i].C_PHONE 
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(USER, res) {
	   var sql_data = {C_NAME:USER.username, C_EMAIL:USER.email, C_PHONE:USER.phone}
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into CUSTOMER set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'Customer creation failed'});
	       } else {
	         res.send({status: 0, message: 'Customer created successfully'});
	       }
	     });
	   });
	 };
	 this.update = function(USER, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {C_NAME:USER.username, C_EMAIL:USER.email, C_PHONE:USER.phone}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update CUSTOMER set ? where C_ID = ?', [sql_data, USER.uid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'Customer update failed'});
	       } else {
	         res.send({status: 0, message: 'Customer:'+ USER.username +'\nUpdated successfully'});
	       }
	     });
	   });
	 };
	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	     	console.log("刪除|| id:" + id);
	       con.query('delete from CUSTOMER where C_ID = ?', [id], function(err, result) {
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
module.exports = new USER();
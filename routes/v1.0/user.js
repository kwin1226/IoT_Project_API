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
	   // var sql_data = {C_NAME:USER.username, C_EMAIL:USER.email, C_PHONE:USER.phone, C_PASS:USER.pass}
	   // sql_data = debug.checkReq(sql_data);
	   var key = '2BC725612ED4DE3B638732F73677DF275385EF3A08E1E78D34A28FED3FCC55C1D41B3E3EE0000711B31A9D2FBD6507F689EC4333C018463D871B0D9DBDE24F56';
	   connection.acquire(function(err, con) {
	     con.query('insert into CUSTOMER (C_NAME, C_EMAIL, C_PHONE, C_PASS) VALUES (?, ?, ? ,AES_ENCRYPT(? , ?))', [USER.username, USER.email, USER.phone, USER.pass, key], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'Customer creation failed'});
	       } else {
	         res.send({status: 0, message: 'Customer created successfully'});
	       }
	     });
	   });
	 };

	 this.login = function(USER, res){
	 	// var sql_data = {C_NAME:USER.username, C_PASS:USER.pass}
	 	// sql_data = debug.checkReq(sql_data);
	 	var key = '2BC725612ED4DE3B638732F73677DF275385EF3A08E1E78D34A28FED3FCC55C1D41B3E3EE0000711B31A9D2FBD6507F689EC4333C018463D871B0D9DBDE24F56';
	 	connection.acquire(function(err, con) {
	 	  con.query('select C_NAME, C_PASS from CUSTOMER where C_NAME = ? AND C_PASS = AES_ENCRYPT( ? , ? )', [USER.username ,USER.pass, key], function(err, result) {
	 	    con.release();
	 	    if(result.length > 0){
	 	    	res.send({status: 0, message: 'Customer login successfully'});
	 	    }else{
	 	    	res.send({status: 1, message: 'Customer login failed'});
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
var connection = require('../../connection');
var debug = require('./debug/debug');

function EVENT() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from EVENT', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		eveid:result[i].EVE_ID,
	      		eveNum:result[i].EVE_NUM,
	      		eveName:result[i].EVE_NAME
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT * FROM EVENT WHERE EVE_ID = ? ',[id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		eveid:result[i].EVE_ID,
	      		eveNum:result[i].EVE_NUM,
	      		eveName:result[i].EVE_NAME
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(EVENT, res) {
	   var sql_data = {EVE_NUM:EVENT.eveNum, EVE_NAME:EVENT.eveName};
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into EVENT set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'EVENT creation failed'});
	       } else {
	         res.send({status: 0, message: 'EVENT created successfully'});
	       }
	     });
	   });
	 };
	 this.update = function(EVENT, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {EVE_NUM:EVENT.eveNum, EVE_NAME:EVENT.eveName};
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update EVENT set ? where EVE_ID = ?', [sql_data, EVENT.EVE_ID], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'EVENT update failed'});
	       } else {
	         res.send({status: 0, message: 'EVENT hid:'+ EVENT.hid +'\nUpdated successfully'});
	       }
	     });
	   });
	 };
	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	     	console.log("刪除|| eveid:" + id );
	       con.query('delete from EVENT where EVE_ID = ?', [id], function(err, result) {
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
module.exports = new EVENT();
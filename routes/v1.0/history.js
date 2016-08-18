var connection = require('../../connection');
var debug = require('./debug/debug');

function HISTORY() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select H_ID, E_ID, EVE_ID, H_Tem, H_Hum, H_ACCIDENT, '+
	    		  'DATE_FORMAT(H_TIME,"%Y-%m-%d %H:%i:%s") as H_TIME, '+
	    		  'DATE_FORMAT(H_U_TIME,"%Y-%m-%d %H:%i:%s") as H_U_TIME from HISTORY', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		hid:result[i].H_ID,
	      		eid:result[i].E_ID,
	      		eveid:result[i].EVE_ID,
	      		historyTem:result[i].H_Tem,
	      		historyHum:result[i].H_Hum,
	      		historyAccident:result[i].H_ACCIDENT,
	      		historyTime:result[i].H_TIME,
	      		historyUTime:result[i].H_U_TIME
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('select H_ID, E_ID, EVE_ID, H_Tem, H_Hum, H_ACCIDENT, '+
	    		  'DATE_FORMAT(H_TIME,"%Y-%m-%d %H:%i:%s") as H_TIME, '+
	    		  'DATE_FORMAT(H_U_TIME,"%Y-%m-%d %H:%i:%s") as H_U_TIME '+
	    		  'FROM HISTORY WHERE E_ID = ? ',[id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		hid:result[i].H_ID,
	      		eid:result[i].E_ID,
	      		eveid:result[i].EVE_ID,
	      		historyTem:result[i].H_Tem,
	      		historyHum:result[i].H_Hum,
	      		historyAccident:result[i].H_ACCIDENT,
	      		historyTime:result[i].H_TIME,
	      		historyUTime:result[i].H_U_TIME
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(HISTORY, res) {
	   var sql_data = {E_ID:HISTORY.eid, U_ID:HISTORY.tid,EVE_ID:HISTORY.eveid ,H_Tem:HISTORY.historyTem, H_Hum:HISTORY.historyHum, H_ACCIDENT:HISTORY.historyAccident, H_TIME:HISTORY.historyTime, H_U_TIME:HISTORY.historyUTime};
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into HISTORY set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'HISTORY creation failed'});
	       } else {
	         res.send({status: 0, message: 'HISTORY created successfully'});
	       }
	     });
	   });
	 };
	 this.update = function(HISTORY, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {E_ID:HISTORY.eid, U_ID:HISTORY.tid,EVE_ID:HISTORY.eveid ,H_Tem:HISTORY.historyTem, H_Hum:HISTORY.historyHum, H_ACCIDENT:HISTORY.historyAccident, H_TIME:HISTORY.historyTime, H_U_TIME:HISTORY.historyUTime};
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update HISTORY set ? where H_ID = ?', [sql_data, HISTORY.hid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'HISTORY update failed'});
	       } else {
	         res.send({status: 0, message: 'HISTORY hid:'+ HISTORY.hid +'\nUpdated successfully'});
	       }
	     });
	   });
	 };
	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	     	console.log("刪除|| hid:" + id );
	       con.query('delete from HISTORY where H_ID = ?', [id], function(err, result) {
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
module.exports = new HISTORY();
var connection = require('../../connection');
var debug = require('./debug/debug');

function AHISTORY() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from A_HISTORY', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		ahid:result[i].A_H_ID,
	      		aid:result[i].A_ID,
	      		hid:result[i].H_ID,
	      		eid:result[i].E_ID,
	      		accidentName:result[i].A_NAME,
	      		historyAccident:result[i].H_ACCIDENT,
	      		historyTime:result[i].H_TIME
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT * FROM A_HISTORY WHERE E_ID = ? ',[id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		ahid:result[i].A_H_ID,
	      		aid:result[i].A_ID,
	      		hid:result[i].H_ID,
	      		eid:result[i].E_ID,
	      		historyAccident:result[i].H_TIME,
	      		historyTime:result[i].A_NAME
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(AHISTORY, res) {
	   var sql_data = {H_ID:AHISTORY.hid, E_ID:AHISTORY.eid, A_ID:AHISTORY.aid, A_NAME:AHISTORY.accidentName, H_ACCIDENT:AHISTORY.historyAccident, H_TIME:AHISTORY.historyTime};
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into A_HISTORY set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'A_HISTORY creation failed'});
	       } else {
	         res.send({status: 0, message: 'A_HISTORY created successfully'});
	       }
	     });
	   });
	 };
	 this.update = function(AHISTORY, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {H_ID:AHISTORY.hid, E_ID:AHISTORY.eid,A_ID:AHISTORY.aid, A_NAME:AHISTORY.accidentName,H_ACCIDENT:AHISTORY.historyAccident, H_TIME:AHISTORY.historyTime};
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update A_HISTORY set ? where A_H_ID = ?', [sql_data, AHISTORY.ahid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'A_HISTORY update failed'});
	       } else {
	         res.send({status: 0, message: 'A_HISTORY hid:'+ AHISTORY.hid +'\nUpdated successfully'});
	       }
	     });
	   });
	 };
	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	     	console.log("刪除|| ahid:" + id );
	       con.query('delete from A_HISTORY where A_H_ID = ?', [id], function(err, result) {
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
module.exports = new AHISTORY();
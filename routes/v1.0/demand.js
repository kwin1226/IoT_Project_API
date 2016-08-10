var connection = require('../../connection');
var debug = require('./debug/debug');

function DEMAND() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from DEMAND', function(err, result) {
	      con.release();
	      res.send(result);
	    });
	  });
	};

	this.find = function(id ,res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from DEMAND where C_ID = ? ',[id], function(err, result) {
	      con.release();
	       var data = [];	
		   for(var i=0; i<result.length; i++){
		      	var tmp = {
		      		did:result[i].D_ID,
		      		uid:result[i].C_ID,
		      		demandName:result[i].D_NAME, 
		      		demandTime:result[i].D_UPDATE_TIME,
		      		demandSick:result[i].D_H_SICK, 
		      		demandAge:result[i].D_YEARS_OLD
		      	};
		       data[data.length] = tmp; //新增array
		    }
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};
	
	this.create = function(DEMAND, res) {
	   var sql_data = {C_ID:DEMAND.uid, D_UPDATE_TIME:DEMAND.demandTime ,D_NAME:DEMAND.demandName, D_H_SICK:DEMAND.demandSick,D_YEARS_OLD:DEMAND.demandAge}
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into DEMAND set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'DEMAND creation failed'});
	       } else {
	         res.send({status: 0, message: 'DEMAND successfully'});
	       }
	     });
	   });
	 };

	 this.update = function(DEMAND, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {D_NAME:DEMAND.demandName, D_UPDATE_TIME:DEMAND.demandTime, D_H_SICK:DEMAND.demandSick,D_YEARS_OLD:DEMAND.demandAge}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update DEMAND set ? where D_ID = ?', [sql_data, DEMAND.did], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'DEMAND update failed'});
	       } else {
	         res.send({status: 0, message: 'DEMAND updated successfully'});
	       }
	     });
	   });
	 };

	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	       con.query('delete from DEMAND where D_ID = ?', [id], function(err, result) {
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

module.exports = new DEMAND();
var connection = require('../../connection');
var debug = require('./debug/debug');

function DNEED() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from D_NEED', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		did:result[i].D_ID,
	      		aid:result[i].A_ID
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT * FROM D_NEED WHERE D_ID = ? ',[id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		did:result[i].D_ID,
	      		aid:result[i].A_ID
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(DNEED, res) {
	   var sql_data = {D_ID:DNEED.did, A_ID:DNEED.aid}
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into D_NEED set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'D_NEED creation failed'});
	       } else {
	         res.send({status: 0, message: 'D_NEED created successfully'});
	       }
	     });
	   });
	 };
	 // this.update = function(DNEED, res) {
	 //   connection.acquire(function(err, con) {
	 //   	 var sql_data = {E_ID:DNEED.eid, S_NAME:DNEED.sensorName}
	 //   	 sql_data = debug.checkReq(sql_data);
	 //     con.query('update D_NEED set ? where S_ID = ?', [sql_data, DNEED.sid], function(err, result) {
	 //       con.release();
	 //       if (err) {
	 //         res.send({status: 1, message: 'D_NEED update failed'});
	 //       } else {
	 //         res.send({status: 0, message: 'D_NEED sid:'+ DNEED.sid +'\nUpdated successfully'});
	 //       }
	 //     });
	 //   });
	 // };
	 this.delete = function(id1, id2, res) {
	     connection.acquire(function(err, con) {
	     	console.log("刪除|| did:" + id1 + " aid:" + id2);
	       con.query('delete from D_NEED where D_ID = ? AND A_ID = ? ', [id1, id2], function(err, result) {
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
module.exports = new DNEED();
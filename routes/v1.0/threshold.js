var connection = require('../../connection');
var debug = require('./debug/debug');

function THRESHOLD() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT A.D_ID, A.A_ID, A.A_NAME, A.A_L_Tem, B.A_L_Hum FROM '+
	    		  '(SELECT * FROM D_L_TEM ) as A join '+
	    		  '(SELECT * FROM D_L_HUM ) as B on A.D_ID = B.D_ID',function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		did:result[i].D_ID,
	      		aid:result[i].A_ID,
	      		accidentName:result[i].A_NAME,
	      		accidentTem:result[i].A_L_Tem,
	      		accidentHum:result[i].A_L_Hum
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT A.D_ID, A.A_ID, A.A_NAME, A.A_L_Tem, B.A_L_Hum FROM '+
	    		  '(SELECT * FROM D_L_TEM WHERE D_ID = ?) as A join  '+
	    		  '(SELECT * FROM D_L_HUM WHERE D_ID = ?) as B on A.D_ID = B.D_ID', 
	    		  [id,id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		did:result[i].D_ID,
	      		aid:result[i].A_ID,
	      		accidentName:result[i].A_NAME,
	      		accidentTem:result[i].A_L_Tem,
	      		accidentHum:result[i].A_L_Hum
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.findmin = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('SELECT A.D_ID, A.A_ID, A.A_NAME, A.A_L_Tem, B.A_L_Hum FROM '+
	    		  '(SELECT * FROM D_L_TEM WHERE D_ID = ?) as A join  '+
	    		  '(SELECT * FROM D_L_HUM WHERE D_ID = ?) as B on A.D_ID = B.D_ID', 
	    		  [id,id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		did:result[i].D_ID,
	      		aid:result[i].A_ID,
	      		accidentName:result[i].A_NAME,
	      		accidentTem:result[i].A_L_Tem,
	      		accidentHum:result[i].A_L_Hum
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.create = function(THRESHOLD, res) {
	   var sql_data = {C_ID:THRESHOLD.uid, E_ID:THRESHOLD.eid, O_OPEN_TIME:THRESHOLD.activitedTime}
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
	 this.update = function(THRESHOLD, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {C_ID:THRESHOLD.uid, E_ID:THRESHOLD.eid, O_OPEN_TIME:THRESHOLD.activitedTime}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update OpenProduct set ? where C_ID = ? AND E_ID = ?', [sql_data, THRESHOLD.uid, THRESHOLD.eid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'OpenProduct update failed'});
	       } else {
	         res.send({status: 0, message: 'OpenProduct uid:'+ THRESHOLD.uid+' eid:'+ THRESHOLD.eid +'\nUpdated successfully'});
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
module.exports = new THRESHOLD();
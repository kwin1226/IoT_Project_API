var connection = require('../../connection');
var debug = require('./debug/debug');

function ACCIDENT() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from ACCIDENT', function(err, result) {
	      con.release();
	      var data = [];	
		   for(var i=0; i<result.length; i++){
		      	var tmp = {
		      		aid:result[i].A_ID,
		      		accidentName:result[i].A_NAME,
		      		accidentSoulution:result[i].A_SOLUTION, 
		      		accidentSymptom:result[i].A_SYMPTOM,
		      		accidentTem:result[i].A_L_Tem, 
		      		accidentHum:result[i].A_L_Hum
		      	};
		       data[data.length] = tmp; //新增array
		    }
		    res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.find = function(id ,res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from ACCIDENT where A_ID = ? ',[id], function(err, result) {
	      con.release();
	       var data = [];	
		   for(var i=0; i<result.length; i++){
		      	var tmp = {
		      		aid:result[i].A_ID,
		      		accidentName:result[i].A_NAME,
		      		accidentSoulution:result[i].A_SOLUTION, 
		      		accidentSymptom:result[i].A_SYMPTOM,
		      		accidentTem:result[i].A_L_Tem, 
		      		accidentHum:result[i].A_L_Hum
		      	};
		       data[data.length] = tmp; //新增array
		    }
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};
	
	this.create = function(ACCIDENT, res) {
	   var sql_data = {A_ID:ACCIDENT.aid, A_NAME:ACCIDENT.accidentName ,A_SOLUTION:ACCIDENT.accidentSoulution, A_SYMPTOM:ACCIDENT.accidentSymptom, A_L_Tem:ACCIDENT.accidentTem, A_L_Hum:ACCIDENT.accidentHum}
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into ACCIDENT set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'ACCIDENT creation failed'});
	       } else {
	         res.send({status: 0, message: 'ACCIDENT successfully'});
	       }
	     });
	   });
	 };

	 this.update = function(ACCIDENT, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {A_ID:ACCIDENT.aid, A_NAME:ACCIDENT.accidentName ,A_SOLUTION:ACCIDENT.accidentSoulution, A_SYMPTOM:ACCIDENT.accidentSymptom, A_L_Tem:ACCIDENT.accidentTem, A_L_Hum:ACCIDENT.accidentHum}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update ACCIDENT set ? where A_ID = ?', [sql_data, ACCIDENT.did], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'ACCIDENT update failed'});
	       } else {
	         res.send({status: 0, message: 'ACCIDENT updated successfully'});
	       }
	     });
	   });
	 };

	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	       con.query('delete from ACCIDENT where A_ID = ?', [id], function(err, result) {
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

module.exports = new ACCIDENT();
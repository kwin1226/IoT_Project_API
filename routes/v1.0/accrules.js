var connection = require('../../connection');
var debug = require('./debug/debug');

function ACCRULES() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from ACC_RULES', function(err, result) {
	      con.release();
	      var data = [];	
		   for(var i=0; i<result.length; i++){
		      	var tmp = {
		      		aid:result[i].A_ID,
		      		eveid:result[i].EVE_ID,
		      		accidentName:result[i].A_NAME,
		      		accidentSoulution:result[i].A_SOLUTION, 
		      		accidentSymptom:result[i].A_SYMPTOM,
		      		eventTrigger:result[i].EVE_TRIGGER
		      	};
		       data[data.length] = tmp; //新增array
		    }
		    res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};

	this.find = function(id ,res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from ACC_RULES where A_ID = ? ',[id], function(err, result) {
	      con.release();
	       var data = [];	
		   for(var i=0; i<result.length; i++){
		      	var tmp = {
		      		aid:result[i].A_ID,
		      		eveid:result[i].EVE_ID,
		      		accidentName:result[i].A_NAME,
		      		accidentSoulution:result[i].A_SOLUTION, 
		      		accidentSymptom:result[i].A_SYMPTOM,
		      		eventTrigger:result[i].EVE_TRIGGER
		      	};
		       data[data.length] = tmp; //新增array
		    }
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格式
	    });
	  });
	};
	
	this.create = function(ACCRULES, res) {
	   var sql_data = {A_ID:ACCRULES.aid, EVE_ID:ACCRULES.eveid, A_NAME:ACCRULES.accidentName ,A_SOLUTION:ACCRULES.accidentSoulution, A_SYMPTOM:ACCRULES.accidentSymptom, EVE_TRIGGER:ACCRULES.eventTrigger}
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into ACC_RULES set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'ACCRULES creation failed'});
	       } else {
	         res.send({status: 0, message: 'ACCRULES successfully'});
	       }
	     });
	   });
	 };

	 this.update = function(ACCRULES, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {A_ID:ACCRULES.aid, EVE_ID:ACCRULES.eveid, A_NAME:ACCRULES.accidentName ,A_SOLUTION:ACCRULES.accidentSoulution, A_SYMPTOM:ACCRULES.accidentSymptom, EVE_TRIGGER:ACCRULES.eventTrigger}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update ACC_RULES set ? where A_ID = ?', [sql_data, ACCRULES.aid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'ACCRULES update failed'});
	       } else {
	         res.send({status: 0, message: 'ACCRULES updated successfully'});
	       }
	     });
	   });
	 };

	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	       con.query('delete from ACC_RULES where A_ID = ?', [id], function(err, result) {
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

module.exports = new ACCRULES();
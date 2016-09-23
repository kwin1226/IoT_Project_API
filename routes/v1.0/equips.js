var connection = require('../../connection');
var debug = require('./debug/debug');

function EQUIPMENT() {
	
	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from EQUIPMENT', function(err, result) {
	      con.release();
	      res.send(result);
	    });
	  });
	};

	this.find = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('select E_ID, D_ID, E_NAME, DATE_FORMAT(E_MAKE_TIME,"%Y-%m-%d %H:%i:%s") as E_MAKE_TIME, DIR_ID, C_ID, DIR_NAME from '+
	    		 '(select EQUIPMENT.E_ID, EQUIPMENT.D_ID, EQUIPMENT.E_NAME, EQUIPMENT.E_MAKE_TIME, DIRECTORY.DIR_ID, DIRECTORY.C_ID ,DIRECTORY.DIR_NAME '+
	    	     'from EQUIPMENT, DIRECTORY where EQUIPMENT.DIR_ID = DIRECTORY.DIR_ID) '+
	    	     'as A where A.E_ID = ?',[id], function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		eid:result[i].E_ID, 
	      		did:result[i].D_ID,
	      		cid:result[i].C_ID,
	      		dirid:result[i].DIR_ID,
	      		equipName:result[i].E_NAME, 
	      		equipPROD:result[i].E_MAKE_TIME,
	      		dirName:result[i].DIR_NAME
	      	};
	       data[data.length] = tmp; //新增array
	      }			
	      res.send(JSON.stringify(data)); //最後將物件轉成JSON格
	    });
	  });
	};

	this.create = function(EQUIPMENT, res) {
	   var sql_data = {E_ID:EQUIPMENT.eid, D_ID:EQUIPMENT.did, E_NAME:EQUIPMENT.equipName, E_MAKE_TIME:EQUIPMENT.equipPROD, DIR_ID:EQUIPMENT.dirid};
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into EQUIPMENT set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'EQUIPMENT creation failed'});
	       } else {
	         res.send({status: 0, message: 'EQUIPMENT successfully'});
	       }
	     });
	   });
	 };

	 this.update = function(EQUIPMENT, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {E_ID:EQUIPMENT.eid, E_NAME:EQUIPMENT.equipName, D_ID:EQUIPMENT.did, E_STATUS:EQUIPMENT.equipStatus, DIR_ID:EQUIPMENT.dirid};
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update EQUIPMENT set ? where E_ID = ?', [sql_data, EQUIPMENT.eid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'EQUIPMENT update failed'});
	       } else {
	         res.send({status: 0, message: 'EQUIPMENT updated successfully'});
	       }
	     });
	   });
	 };

	 this.delete = function(E_ID, res) {
	     connection.acquire(function(err, con) {
	       con.query('delete from EQUIPMENT where E_ID = ?', [E_ID], function(err, result) {
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

module.exports = new EQUIPMENT();
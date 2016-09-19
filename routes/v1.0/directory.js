var connection = require('../../connection');
var debug = require('./debug/debug');

function DIRECTORY() {
	
	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from DIRECTORY', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		cid:result[i].C_ID,
	      		dirid:result[i].DIR_ID,
	      		dirName:result[i].DIR_NAME
	      	};
	       data[data.length] = tmp; 
	      }			
	      res.send(JSON.stringify(data)); 
	    });
	  });
	};

	this.find = function(id,res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from DIRECTORY where C_ID = ?', [id] , function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		cid:result[i].C_ID,
	      		dirid:result[i].DIR_ID,
	      		dirName:result[i].DIR_NAME
	      	};
	       data[data.length] = tmp; 
	      }			
	      res.send(JSON.stringify(data)); 
	    });
	  });
	};

	this.findchild = function(id, res) {
	  connection.acquire(function(err, con) {
	    con.query('select * from ' +
	    	'( select EQUIPMENT.E_ID, EQUIPMENT.D_ID, EQUIPMENT.E_NAME, DATE_FORMAT(EQUIPMENT.E_MAKE_TIME,"%Y-%m-%d %H:%i:%s") as E_MAKE_TIME, DIRECTORY.DIR_ID, DIRECTORY.DIR_NAME '+
	    	'from EQUIPMENT, DIRECTORY where EQUIPMENT.DIR_ID = DIRECTORY.DIR_ID) as A ' + 
	    	'where A.DIR_ID = ?',[id], function(err, result) {
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

	this.create = function(DIRECTORY, res) {
	   var sql_data = {C_ID:DIRECTORY.cid, DIR_NAME:DIRECTORY.dirName};
	   sql_data = debug.checkReq(sql_data);
	   connection.acquire(function(err, con) {
	     con.query('insert into DIRECTORY set ?', sql_data, function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'DIRECTORY creation failed'});
	       } else {
	         res.send({status: 0, message: 'DIRECTORY successfully'});
	       }
	     });
	   });
	 };

	 this.update = function(DIRECTORY, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {DIR_NAME:DIRECTORY.dirName};
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update DIRECTORY set ? where DIR_ID = ?', [sql_data, DIRECTORY.dirid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'DIRECTORY update failed'});
	       } else {
	         res.send({status: 0, message: 'DIRECTORY updated successfully'});
	       }
	     });
	   });
	 };

	 this.delete = function(id, res) {
	     connection.acquire(function(err, con) {
	       con.query('delete from DIRECTORY where DIR_ID = ?', [id], function(err, result) {
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

module.exports = new DIRECTORY();
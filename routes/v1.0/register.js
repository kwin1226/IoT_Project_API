var connection = require('../../connection');
var debug = require('./debug/debug');

function REGISTER() {

	this.get = function(res) {
	  connection.acquire(function(err, con) {
	    con.query('select C_ID, E_ID, '+
	    		  'DATE_FORMAT(O_OPEN_TIME,"%Y-%m-%d %H:%i:%s") as O_OPEN_TIME '+
	    		  'from OpenProduct', function(err, result) {
	      con.release();
	      var data = [];	
	      for(var i=0; i<result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		eid:result[i].E_ID, 
	      		activitedTime:result[i].O_OPEN_TIME
	      	};
	       data[data.length] = tmp; //新增新array
	      }
	      res.send(JSON.stringify(data));
	    });
	  });
	};

	this.find = function(id, res) {  //JSON 格式比較特別
	  connection.acquire(function(err, con) { 
	    con.query('SELECT C.C_ID, C.E_ID, C.D_ID, C.DIR_ID, D.DIR_NAME, C.E_NAME, C.E_STATUS, C.E_MAKE_TIME, C.O_OPEN_TIME FROM ' + 
	    		  '(SELECT C_ID, A.E_ID, D_ID, DIR_ID, E_NAME, E_STATUS, DATE_FORMAT(E_MAKE_TIME,"%Y-%m-%d %H:%i:%s") as E_MAKE_TIME , '+
	    		  'DATE_FORMAT(O_OPEN_TIME,"%Y-%m-%d %H:%i:%s") as O_OPEN_TIME FROM '+
	    		  '(SELECT * FROM EQUIPMENT WHERE E_ID IN (SELECT E_ID FROM OpenProduct WHERE C_ID = ?)) as A '+
	    		  'join (SELECT * FROM OpenProduct WHERE C_ID = ? ) as B on A.E_ID = B.E_ID) as C ' +
	    		  'join (SELECT * FROM DIRECTORY WHERE C_ID = ? ) as D on C.DIR_ID = D.DIR_ID;', 
	    		  [id,id,id], function(err, result) {
	      con.release();
	      var data = {}; 
	      for(var i=0; i< result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		eid:result[i].E_ID, 
	      		did:result[i].D_ID,
	      		dirid:result[i].DIR_ID,
	      		dirName:result[i].DIR_NAME,
	      		equipStatus:result[i].E_STATUS,
	      		equipName:result[i].E_NAME, 
	      		equipPROD:result[i].E_MAKE_TIME, 
	      		activitedTime:result[i].O_OPEN_TIME
	      	};
	      	var dirid = result[i].DIR_ID;
	      	if(data.hasOwnProperty(dirid)){ //存在同id就新增子
	      	    data[dirid].push(tmp);
	      	}else{  //不存在同id新增類別
	      	    data[dirid] = []; //category
	      	    data[dirid].push(tmp);
	      	}
	      }		
	      res.send(JSON.stringify(data)); 
	    });
	  });
	};

	this.search = function(id, keyword, res) {  //JSON 模糊查詢
		keyword = '%' +  decodeURIComponent(keyword) + '%';
	  connection.acquire(function(err, con) { 
	    con.query('SELECT * FROM (' + 
	    		  'SELECT C.C_ID, C.E_ID, C.D_ID, C.DIR_ID, D.DIR_NAME, C.E_NAME, C.E_STATUS, C.E_MAKE_TIME, C.O_OPEN_TIME FROM ' + 
	    		  '(SELECT C_ID, A.E_ID, D_ID, DIR_ID, E_NAME, E_STATUS, DATE_FORMAT(E_MAKE_TIME,"%Y-%m-%d %H:%i:%s") as E_MAKE_TIME , '+
	    		  'DATE_FORMAT(O_OPEN_TIME,"%Y-%m-%d %H:%i:%s") as O_OPEN_TIME FROM '+
	    		  '(SELECT * FROM EQUIPMENT WHERE E_ID IN (SELECT E_ID FROM OpenProduct WHERE C_ID = ?)) as A '+
	    		  'join (SELECT * FROM OpenProduct WHERE C_ID = ? ) as B on A.E_ID = B.E_ID) as C ' +
	    		  'join (SELECT * FROM DIRECTORY WHERE C_ID = ? ) as D on C.DIR_ID = D.DIR_ID )as E WHERE E.E_NAME LIKE ? ;', 
	    		  [id,id,id,keyword], function(err, result) {
	      con.release();
	      var data = {}; 
	      for(var i=0; i< result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		eid:result[i].E_ID, 
	      		did:result[i].D_ID,
	      		dirid:result[i].DIR_ID,
	      		dirName:result[i].DIR_NAME,
	      		equipStatus:result[i].E_STATUS,
	      		equipName:result[i].E_NAME, 
	      		equipPROD:result[i].E_MAKE_TIME, 
	      		activitedTime:result[i].O_OPEN_TIME
	      	};
	      	var dirid = result[i].DIR_ID;
	      	if(data.hasOwnProperty(dirid)){ //存在同id就新增子
	      	    data[dirid].push(tmp);
	      	}else{  //不存在同id新增類別
	      	    data[dirid] = []; //category
	      	    data[dirid].push(tmp);
	      	}
	      }		
	      res.send(JSON.stringify(data)); 
	    });
	  });
	};

	this.usingsearch = function(id, res) {  //JSON 模糊查詢
	
	  connection.acquire(function(err, con) { 
	    con.query('SELECT * FROM (' + 
	    		  'SELECT C.C_ID, C.E_ID, C.D_ID, C.DIR_ID, D.DIR_NAME, C.E_NAME, C.E_STATUS, C.E_MAKE_TIME, C.O_OPEN_TIME FROM ' + 
	    		  '(SELECT C_ID, A.E_ID, D_ID, DIR_ID, E_NAME, E_STATUS, DATE_FORMAT(E_MAKE_TIME,"%Y-%m-%d %H:%i:%s") as E_MAKE_TIME , '+
	    		  'DATE_FORMAT(O_OPEN_TIME,"%Y-%m-%d %H:%i:%s") as O_OPEN_TIME FROM '+
	    		  '(SELECT * FROM EQUIPMENT WHERE E_ID IN (SELECT E_ID FROM OpenProduct WHERE C_ID = ?)) as A '+
	    		  'join (SELECT * FROM OpenProduct WHERE C_ID = ? ) as B on A.E_ID = B.E_ID) as C ' +
	    		  'join (SELECT * FROM DIRECTORY WHERE C_ID = ? ) as D on C.DIR_ID = D.DIR_ID )as E WHERE E.E_STATUS = 1 ;', 
	    		  [id,id,id], function(err, result) {
	      con.release();
	      var data = {}; 
	      for(var i=0; i< result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		eid:result[i].E_ID, 
	      		did:result[i].D_ID,
	      		dirid:result[i].DIR_ID,
	      		dirName:result[i].DIR_NAME,
	      		equipStatus:result[i].E_STATUS,
	      		equipName:result[i].E_NAME, 
	      		equipPROD:result[i].E_MAKE_TIME, 
	      		activitedTime:result[i].O_OPEN_TIME
	      	};
	      	var dirid = result[i].DIR_ID;
	      	if(data.hasOwnProperty(dirid)){ //存在同id就新增子
	      	    data[dirid].push(tmp);
	      	}else{  //不存在同id新增類別
	      	    data[dirid] = []; //category
	      	    data[dirid].push(tmp);
	      	}
	      }		
	      res.send(JSON.stringify(data)); 
	    });
	  });
	};

	this.alertsearch = function(id, res) {  //JSON 模糊查詢
	
	  connection.acquire(function(err, con) { 
	    con.query('SELECT * FROM (' + 
	    		  'SELECT C.C_ID, C.E_ID, C.D_ID, C.DIR_ID, D.DIR_NAME, C.E_NAME, C.E_STATUS, C.E_MAKE_TIME, C.O_OPEN_TIME FROM ' + 
	    		  '(SELECT C_ID, A.E_ID, D_ID, DIR_ID, E_NAME, E_STATUS, DATE_FORMAT(E_MAKE_TIME,"%Y-%m-%d %H:%i:%s") as E_MAKE_TIME , '+
	    		  'DATE_FORMAT(O_OPEN_TIME,"%Y-%m-%d %H:%i:%s") as O_OPEN_TIME FROM '+
	    		  '(SELECT * FROM EQUIPMENT WHERE E_ID IN (SELECT E_ID FROM OpenProduct WHERE C_ID = ?)) as A '+
	    		  'join (SELECT * FROM OpenProduct WHERE C_ID = ? ) as B on A.E_ID = B.E_ID) as C ' +
	    		  'join (SELECT * FROM DIRECTORY WHERE C_ID = ? ) as D on C.DIR_ID = D.DIR_ID )as E WHERE E.E_STATUS = 2 ;', 
	    		  [id,id,id], function(err, result) {
	      con.release();
	      var data = {}; 
	      for(var i=0; i< result.length; i++){
	      	var tmp = {
	      		uid:result[i].C_ID, 
	      		eid:result[i].E_ID, 
	      		did:result[i].D_ID,
	      		dirid:result[i].DIR_ID,
	      		dirName:result[i].DIR_NAME,
	      		equipStatus:result[i].E_STATUS,
	      		equipName:result[i].E_NAME, 
	      		equipPROD:result[i].E_MAKE_TIME, 
	      		activitedTime:result[i].O_OPEN_TIME
	      	};
	      	var dirid = result[i].DIR_ID;
	      	if(data.hasOwnProperty(dirid)){ //存在同id就新增子
	      	    data[dirid].push(tmp);
	      	}else{  //不存在同id新增類別
	      	    data[dirid] = []; //category
	      	    data[dirid].push(tmp);
	      	}
	      }		
	      res.send(JSON.stringify(data)); 
	    });
	  });
	};

	this.create = function(REGISTER, res) {
	   var sql_data = {C_ID:REGISTER.uid, E_ID:REGISTER.eid, O_OPEN_TIME:REGISTER.activitedTime}
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
	 this.update = function(REGISTER, res) {
	   connection.acquire(function(err, con) {
	   	 var sql_data = {C_ID:REGISTER.uid, E_ID:REGISTER.eid, O_OPEN_TIME:REGISTER.activitedTime}
	   	 sql_data = debug.checkReq(sql_data);
	     con.query('update OpenProduct set ? where C_ID = ? AND E_ID = ?', [sql_data, REGISTER.uid, REGISTER.eid], function(err, result) {
	       con.release();
	       if (err) {
	         res.send({status: 1, message: 'OpenProduct update failed'});
	       } else {
	         res.send({status: 0, message: 'OpenProduct uid:'+ REGISTER.uid+' eid:'+ REGISTER.eid +'\nUpdated successfully'});
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
module.exports = new REGISTER();
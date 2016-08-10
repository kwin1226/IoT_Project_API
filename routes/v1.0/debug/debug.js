function debug(){
	this.checkReq = function(data){
		var obj = data;
		for (var key in data) {
		    // skip loop if the property is from prototype
		    if (!data.hasOwnProperty(key)) continue;
		     
		     if(data[key]==undefined || data[key]=="" ||  data[key]==null){
		     	delete obj[key];
		     }else{
		     	console.log(key + ":" + data[key]);
		     }
		}
		return obj;
	};
}

module.exports = new debug();
var path    = require("path");
 
module.exports = {
  configure: function(app, version, routes) {
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname+'/templates/index.html'));
    });

    var handlers = {};
        version.forEach(function (ver){  //從conf>index.js中的conf.application.version 動態新增版本
            routes.forEach(function(val){ //從conf>index.js中的conf.application.routes 動態新增路由
            try {
            handlers[val] = require('./routes/'+ver+ '/' +val);

            app.get('/'+ ver +'/' +val, function(req, res){
                handlers[val].get(res);
                });
            app.get('/'+ ver +'/' + val +'/:id', function(req, res){
                handlers[val].find(req.params.id, res);
                });
            app.post('/'+ ver +'/' + val +'/', function(req, res){
                console.log("封包 > " + (req));
                console.log("req.body > " + JSON.stringify(req.body));
                handlers[val].create(req.body, res);
                });
            app.put('/'+ ver +'/' + val +'/', function(req, res){
                handlers[val].update(req.body, res);
                });
            app.delete('/'+ ver +'/' + val +'/:id', function(req, res){
                handlers[val].delete(req.params.id, res);
                });
            app.get('/'+ ver +'/' + val +'/child/:id', function(req, res){ //目前只有directory.js用到
                handlers[val].findchild(req.params.id, res);
                });
            app.delete('/'+ ver +'/' + val +'/:id1/:id2', function(req, res){
                handlers[val].delete(req.params.id1, req.params.id2, res);
                });
            app.get('/'+ ver +'/' + val +'/:id/date/:start/:end', function(req, res){ //目前只有history.js用到
                var array =[req.params.start, req.params.end, req.params.id];
                handlers[val].findBytime(array, res);
                });
            app.get('/'+ ver +'/' + val +'/:id/date/:start/', function(req, res){ //目前只有history.js用到
                var array =[req.params.start, req.params.id];
                handlers[val].findBytimelimt(array, res);
                });
            app.get('/'+ ver +'/' + val +'/:id1/:id2', function(req, res){
                handlers[val].search(req.params.id1, req.params.id2, res);
                });
            } catch (err) {
                console.error("||err: " + err.code);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    err.code
                });
                }
            });
        });
  }
};
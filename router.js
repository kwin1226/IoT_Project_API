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
                handlers[val].create(req.body, res);
                });
            app.put('/'+ ver +'/' + val +'/', function(req, res){
                handlers[val].update(req.body, res);
                });
            app.delete('/'+ ver +'/' + val +'/:id', function(req, res){
                handlers[val].delete(req.params.id, res);
                });
            app.delete('/'+ ver +'/' + val +'/:id1/:id2', function(req, res){
                handlers[val].delete(req.params.id1, req.params.id2, res);
                });
            app.get('/'+ ver +'/' + val +'/getjoin/:id', function(req, res){ //目前只有threshold.js用到
                handlers[val].join(req.params.id, res);
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
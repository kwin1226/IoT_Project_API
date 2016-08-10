var fs = require('fs');
var results = [];
var walk = function(dir, done) {

  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      // file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

// exports.getFiles = function getFiles(path){
  walk('../routes/', function(err, results) {
    if (err) throw err;
    console.log(results);
  });
//   return results;
// }
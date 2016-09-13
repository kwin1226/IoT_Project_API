var tool = require('cloneextend'),
    // routes_files = require('./routes_files').getFiles('../routes/'),
    conf = {};
    conf.production = {
        application:    {
            errorHandler: {},
            username    : 'demo',
            password    : 'Que62msjiDU0b2yYvi2zbavw' // bEdESpuGU3rewasaphEfaKedR7r=M#fU
        },
        server:         {
            port        : '80'
        }
    };
    conf.development = {
        db:             {
            mysql:          {
                host        : '140.138.77.152',
                user        : 'mysql_bot1',
                password    : '284gj4rm42l3xjp4',
                database    : '2016_bigdata_team04'
            }
        },
        application:    {
            errorHandler: { dumpExceptions: true, showStack: true }
        }
    };
    conf.defaults = {
        application:    {
            salt        : '1234567890QWERTY',
            username    : 'clangton', //testuser
            password    : 'GR+adJAdWOxFQMLFHAWPig==', //testpassword
            realm       : 'Authenticated',
            version     : ['v1.0'],
            routes      : ['user','demand','equips','register','sens', 'history','ahistory','event','accrules','dneed','directory'],
            middleware  : ['compress','json','urlencoded','logger']
        },
        server:         {
            host        : 'localhost',
            port        : 5000
        }
    };

exports.get = function get(env, obj){
    var settings = tool.cloneextend(conf.defaults, conf[env]);
    return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
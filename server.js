var Hapi = require("hapi");
var Routes = require('./app/routes.js');
var mongoose = require('mongoose');
var config = require('./config');
var db = config.db;

mongoose.connect(db);

var serverOpts = {
    debug: {
  request: ['error']
    }, 
  cors: true  
};

var server = new Hapi.Server(process.env.PORT || 8080, serverOpts);

server.views({
    engines: {
            swig: require('swig')},
    path: './views'
});

server.pack.register(require('hapi-auth-cookie'), function (err) {

    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/auth',
        isSecure: false
    });

    server.route(Routes)

    server.start(function(err) {
            if (err) { console.log('error message ' + err);}

            console.log('Hapi server started @ ' + server.info.uri);
            console.log('server started on port: ', server.info.port);
        });
});
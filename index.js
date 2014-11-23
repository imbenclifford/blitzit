var Hapi = require("hapi");
var Config = require("./config.js");
var Good = require('good');
var Routes = require('./routes.js')


// turn debugging on
var serverOpts = {
    debug: {
  request: ['error']
    }, 
  cors: true  
};

// include the serverOpts
var server = new Hapi.Server(process.env.PORT || 8080, serverOpts);

var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: Good.GoodConsole
    }, {
        reporter: Good.GoodFile,
        args: ['./fixtures/awesome', {
            events: {
                ops: '*'
            }
        }]
    }, {
        reporter: require('good-http'),
        args: [process.env.PORT || 'http://localhost:8080', {
            events: {
                error: '*'
            },
            threshold: 20,
            wreck: {
                headers: { 'x-api-key' : 12345 }
            }
        }]
    }]
};

server.views({
    engines: {
			swig: require('swig')},
    path: './views'
});

server.pack.register(
  { plugin: require('good'), options: options },
 function (err) {

    if (err) { console.error(err); throw err;}
  server.route(Routes);
  server.start(function(err) {
        if (err) { console.log('error message ' + err);}

        console.log('Hapi server started @ ' + server.info.uri);
        console.log('server started on port: ', server.info.port);
    });
})

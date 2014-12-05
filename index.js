var Hapi = require("hapi");
var config = require("./config.js");
var Good = require('good');
var Routes = require('./routes.js');
var BufferApp = require('node-bufferapp');

var bufferapp = new BufferApp({
    clientID : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
    callbackURL : "http://localhost:8080/callback"
});

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

server.route({
    method: 'GET',
    path:'/auth2',
    handler: function(req, res) {
    res.redirect(bufferapp.getAuthorizationURI());
    }
});

server.route({
    method: 'GET',
    path: '/callback',
    handler: function(req, res) {
    // Extract the code that would have been sent as a query parameter to your callback URL
        var code = req.query.code;
        bufferapp.login(code, function(error, user) {
            // user is an instance of BufferUser which can then be used to make authorized api calls
            user.getInfo(function(err, info) {
                console.log(JSON.stringify(info));
            });
        });
    }
})

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

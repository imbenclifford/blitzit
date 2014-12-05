var Hapi = require("hapi");
var config = require("./config.js");
var BufferApp = require('node-bufferapp');
var updates = require('node-bufferapp/lib/updates');

var request = require('request');

var bufferapp = new BufferApp({
    clientID : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
    callbackURL : "http://localhost:8080/callback"
});

var server = new Hapi.Server(process.env.PORT || 8080);

var access_token;
var infoSTRING;
var result;

    var callback = function(req, res) {
        // Extract the code that would have been sent as a query parameter to your callback URL
            var code = req.query.code;
            bufferapp.login(code, function(error, user) {
                if (error){
                        console.log(error + " --login nono")
                    } 
                // user is an instance of BufferUser which can then be used to make authorized api calls
                console.log(user)
                user.getInfo(function(err, info) {
                    infoSTRING = JSON.stringify(info)
                    req.auth.session.set({
                        uid: info.id,
                        _token: user._token,
                        __api_base: user.__api_base
                    })
                });
                res.redirect("/statuses")
            })
    };

    var statuses = function(req, res) {
        var session = req.auth.session
        console.log("the req.auth is " + JSON.stringify(req.auth))
        console.log("the session is " + JSON.stringify(session))
            session.getOneUpdate('52d5bd8072c22ff97c00009c', function(error, callback){
                if (error){
                    console.log(error)
                }
            console.log(callback)
            })
        res('got em ')
        }

server.pack.register(require('hapi-auth-cookie'), function (err) {

    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false
    });

    server.route({
        method: 'GET',
        path:'/auth',
        handler: function(req, res) {
        res.redirect(bufferapp.getAuthorizationURI());
        }
    }); 

    server.route({
        method: 'GET',
        path: '/callback',
        config: {
                    handler: callback,
                    auth: {
                        mode: 'try',
                        strategy: 'session'
                    },
                    plugins: {
                        'hapi-auth-cookie': {
                            redirectTo: false
                        }
                    }
                }
    })

    server.route({
        method: 'GET',
        path: '/statuses',
        config: {
                    handler: statuses,
                    auth: 'session'
                }
    })

    server.start(function(err) {
            if (err) { console.log('error message ' + err);}

            console.log('Hapi server started @ ' + server.info.uri);
            console.log('server started on port: ', server.info.port);
        });
});


/*var home = function (request, reply) {

    reply('<html><head><title>Login page</title></head><body><h3>Welcome '
      + request.auth.credentials.name
      + '!</h3><br/><form method="get" action="/logout">'
      + '<input type="submit" value="Logout">'
      + '</form></body></html>');
};

var ello = function (request, reply) {
    reply('ello, well here we are ' + request.auth.credentials.name)
}

var login = function (request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    var account = john;


    request.auth.session.set(account);
    return reply.redirect('/');
};

var logout = function (request, reply) {

    request.auth.session.clear();
    return reply.redirect('/');
};




    server.route([
        {
            method: 'GET',
            path: '/',
            config: {
                handler: home,
                auth: 'session'
            }
        },
        {
            method: 'GET',
            path: '/ello',
            config: {
                handler: ello,
                auth: 'session'
            }
        },
        {
            method: ['GET', 'POST'],
            path: '/login',
            config: {
                handler: login,
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/logout',
            config: {
                handler: logout,
                auth: 'session'
            }
        }
    ]);

    server.start();
});*/
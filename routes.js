var handlers = require("./handlers.js");

module.exports = [
  {
    method: 'GET',
    path:'/auth',
    config: {
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            },
    handler: handlers.auth
  },
  {
    method: 'GET',
    path: '/callback',
    config: {
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            },
    handler: handlers.callback
  },
  {
    method: 'GET',
    path: '/statuses',
    config: {
                auth: {
                    mode: 'required',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            },
    handler: handlers.statuses
  },
  {
    method: 'POST',
    path: '/create',
    config: {
                auth: {
                    mode: 'try',
                    strategy: 'session'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                }
            },
    handler: handlers.create
},
{
  method : "GET",
  path :  "/{param*}",
  handler :  {
    directory: {
      path: "./public",
      listing: false,
      index: false
    }
  }
}]

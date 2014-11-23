var handlers = require("./handlers.js");

module.exports = [
	{
    method: 'GET',
    path:  '/home',
	handler: handlers.home
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

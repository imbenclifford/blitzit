var exports = module.exports = {};
//to static files to server returns eg. CSS
exports.loadEntry = {
    directory: {
        path: 'public',
        listing: true
    }
}

exports.home = function (req, res){
	res.view('./home.swig');
	
}

exports.auth = function(req, res) {
    // Your user has to authorize your app to use his/her account
    res.redirect(Config.CALLBACK_URL);
}

exports.callback = function(req, res) {
    // Extract the code that would have been sent as a query parameter to your callback URL
    var code = req.query.code;
    bufferapp.login(code, function(error, user) {
        // user is an instance of BufferUser which can then be used to make authorized api calls
        user.getInfo(function(err, info) {
            console.log(JSON.stringify(info));
        });
    });
};
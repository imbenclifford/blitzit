var exports = module.exports = {};
var BufferApp = require('node-bufferapp');
var config = require("./config.js");

var bufferapp = new BufferApp({
    clientID : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
    callbackURL : "http://localhost:8080/callback"
});

//to static files to server returns eg. CSS
exports.loadEntry = {
    directory: {
        path: 'public',
        listing: true
    }
}

    exports.auth = function(req, res) {
    res.redirect(bufferapp.getAuthorizationURI());
    }

    exports.callback = function(req, res) {
        // Extract the code that would have been sent as a query parameter to your callback URL
        var code = req.query.code;
        var sid;
        var uid;
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login nono")
            }
            user.getAllProfiles(function(err, info) {
                sid = info[0]._id;
                uid = info[0].user_id
                req.auth.session.set({
                    code: code,
                    sid: sid,
                    uid: uid
                })
                res.redirect('/statuses')
            })
        })
    };

    exports.statuses = function(req, res) {
        var code = req.auth.artifacts.code
        var sid = req.auth.artifacts.sid
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login BIGnono")
            }
            user.getBufferedUpdates(sid, function(error, callback){
                if (error){
                    console.log(error)
                }
            console.log("THIS IS WHAT I WAS LOOKING 44444 " + JSON.stringify(callback))
            res.view('updates.swig', {status: callback.updates[0].text,
                                        date: callback.updates[0].day,
                                        time: callback.updates[0].due_time})
            })
        });
    };

    exports.create = function (req, res){
        var code = req.auth.artifacts.code
        var sid = req.auth.artifacts.sid
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login CREATEnono")
            }
            user.createStatus("We", [sid], function(error, callback){
                if (error){
                    console.log(error)
                }
                console.log("I sure this MUST have posted" + JSON.stringify(callback) + "--the sid--" + sid + "--the code--" + code)
            })
            res('wootwoo')
        });
    }
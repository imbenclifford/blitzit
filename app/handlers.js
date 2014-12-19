var exports = module.exports = {};
var BufferApp = require('node-bufferapp');
var config = require("../config.js");

var bufferapp = new BufferApp({
    clientID : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
    callbackURL : "http://localhost:8080/callback"
});

var Todo = require('./models/todo');

function getTodos(res){
    Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res(todos); // return all todos in JSON format
        });
};

//to static files to server returns eg. CSS
exports.loadEntry = {
    directory: {
        path: 'public',
        listing: true
    }
}

//TODO

exports.getTD = function(req, res) {

        // use mongoose to get all todos in the database
        getTodos(res);
    };

    // create todo and send back all todos after creation
exports.createTD = function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.payload.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    };

    // delete a todo
exports.deleteTD = function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    };

exports.index = function(req, res){
    res.file('./public/index.html')
}

//BLITZIT
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
                                        time: callback.updates[0].due_time,
                                        id: callback.updates[0].id})
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
            user.createStatus("I failed to " + req.payload.task + "! Hopefully posting this through bit.ly/blitzitio will mean I do better next time" , [sid], function(error, callback){
                if (error){
                    console.log(error)
                }
                console.log("I sure this MUST have posted" + JSON.stringify(callback) + "--the sid--" + sid + "--the code--" + code)
            })
            res('wootwoo')
        });
    }

    exports.completed = function (req, res){
        console.log('LOAD THIS' + JSON.stringify(req.payload))
        var code = req.auth.artifacts.code
        var sid = req.auth.artifacts.sid
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login COMPLETEnono")
            }
            user.updateStatus(req.payload.id, "I just " + req.payload.task + "! I'm not showing off - bit.ly/blitzitio posted this on my behalf" , false, [], false, 1515582000, function(error, callback){
                if (error){
                    console.log(error)
                }
                console.log("HOPES this has posted " + JSON.stringify(callback) + "--the sid--" + sid + "--the code--" + code)
            })
            res('twootwoow')
        });
    }
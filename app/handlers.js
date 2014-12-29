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
            if (err)
                res(err)

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
exports.create = function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.payload.text,
            date: req.payload.date,
            done : false
        }, function(err, todo) {
            if (err)
                res(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    };

    // delete a todo
exports.completed = function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res(err);

            getTodos(res);
        });
    };

exports.index = function(req, res){
    var user = req.auth.artifacts.user;
    var sid;
    var uid;
    req.auth.session.set({
                    user: user,
                    sid: sid,
                    uid: uid
                })
    console.log('wanna see some code? Here it is: ' + JSON.stringify(req.auth))
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
            console.log("the user is " + JSON.stringify(user))
            user.getAllProfiles(function(err, info) {
                sid = info[0]._id;
                uid = info[0].user_id
                req.auth.session.set({
                    user: user,
                    sid: sid,
                    uid: uid
                })
                console.log("here I am" + code)
                res.redirect('/')
            });
        })
    }

    exports.statuses = function(req, res) {
        var user = req.auth.artifacts.user
        var sid = req.auth.artifacts.sid
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login BIGnono")
            }
            user.getBufferedUpdates(sid, function(error, callback){
                if (error){
                    console.log(error)
                }
                req.auth.session.set({
                    code: code
                })
            console.log("THIS IS WHAT I WAS LOOKING 44444 " + JSON.stringify(callback))
            res.view('updates.swig', {status: callback.updates[0].text,
                                        date: callback.updates[0].day,
                                        time: callback.updates[0].due_time,
                                        id: callback.updates[0].id})
            })
        });
        console.log("THIS IS WHAT I WAS LOOKING 44444 " + JSON.stringify(callback))
        res.view('updates.swig', {status: callback.updates[0].text,
                                    date: callback.updates[0].day,
                                    time: callback.updates[0].due_time,
                                    id: callback.updates[0].id})
    }

    exports.createTD = function (req, res){
        var user = req.auth.artifacts.user
        var sid = req.auth.artifacts.sid
        //Creating ToDo on BufferApp
        user.createStatus("Test: " + req.payload.text + " testo!" , [sid], false, false, false, [], req.payload.date, function(error, callback){
            if (error){
                console.log(error)
            }
            console.log("I sure this MUST have posted" + JSON.stringify(callback) + "--the sid--" + sid + "--the code--" + code)
            req.auth.session.set({
                user: user
            })
            //Creating ToDo on the database
            Todo.create({
                    text : req.payload.text,
                    date: req.payload.date,
                    done : false
                }, function(err, todo) {
                    if (err)
                        res(err);

                // get and return all the todos after you create another
                getTodos(res);
                })
        });
    }

    exports.deleteTD = function (req, res){
        console.log('LOAD THIS' + JSON.stringify(req.auth))
        var user = req.auth.artifacts.user
        var sid = req.auth.artifacts.sid
        user.updateStatus(req.params.todo_id, "Completed " + req.payload.task + "! Testo" , false, [], false, function(error, callback){
            if (error){
                console.log(error)
            }
            console.log("HOPES this has posted " + JSON.stringify(callback) + "--the sid--" + sid + "--the code--" + code)
            req.auth.session.set({
                code: code
            })
        Todo.remove({
            _id : req.params.todo_id
            }, function(err, todo) {
            if (err)
                res(err);

            getTodos(res);
            });
        })
    }
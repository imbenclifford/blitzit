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

exports.index = function(req, res){
    var code = req.auth.artifacts.code;
    var sid = req.auth.artifacts.sid;
    req.auth.session.set({
                    code: code,
                    sid: sid
                })
    res.file('./public/index.html')
}

//BLITZIT
    exports.auth = function(req, res) {
    res.redirect(bufferapp.getAuthorizationURI());
    }

    exports.callback = function(req, res) {
        // Extract the code that would have been sent as a query parameter to your callback URL
        var code = req.query.code;
        var sid = req.query.sid;
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login nono")
            }
            console.log("the user is " + JSON.stringify(user))
            user.getAllProfiles(function(err, info) {
                sid = info[0]._id;
                req.auth.session.set({
                    code: code,
                    sid: sid
                })
                console.log("here I am" + code)
                res.redirect('/')
            });
        })
    }

    exports.createTD = function (req, res){
        var code = req.auth.artifacts.code
        var sid = req.auth.artifacts.sid
        //Creating ToDo on BufferApp
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login error when creating")
            }
            user.createStatus("Test: " + req.payload.text + " testo!" , [sid], false, false, false, [], req.payload.date, function(error, callback){
                if (error){
                    console.log(error)
                }
            console.log("Successfully sent to buffer" + JSON.stringify(callback) + "--the sid--" + sid + "--the code--" + code)
            })
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
    }

    exports.deleteTD = function (req, res){
        var code = req.auth.artifacts.code
        var sid = req.auth.artifacts.sid
        //Updating status to say its completed
        bufferapp.login(code, function (error, user) {
            if (error){
                    console.log(error + " --login error when deleting")
            }
            user.updateStatus(req.params.todo_id, "Completed " + req.payload.task + "! Testo" , false, [], false, function(error, callback){
                if (error){
                    console.log(error)
                }
            console.log("Successfully updated buffer status" + JSON.stringify(callback) + "--the sid--" + sid + "--the code--" + code)
            })
        })
        //Removing todo from database
        Todo.remove({
            _id : req.params.todo_id
            }, function(err, todo) {
            if (err)
                res(err);

            getTodos(res);
            });
    }
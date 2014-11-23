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
/**
 * Created by lisabatbouta on 2/11/15.
 */
module.exports = function(app, reqs) {
    // ------------ API endpoints -----------------
    // this file is used to get the partials or data

    // --------------- HOME PAGE VIEWS -----------------
    // GET the main game jade template
    app.get('/', function (req, res) {
        //// set the options
        var options = {};
        // set the locals
        var locals = {};

        var fn = reqs.jade.compileFile('./views/home.jade', options);
        // send back the compiled jade file
        res.send(fn(locals));

    });
}
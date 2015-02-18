/**
 * Created by lisabatbouta on 2/11/15.
 */
var jade = require('jade');
var request = require('request');

requirements = {
    'jade' : jade,
    'request' : request
};

// register all routes
function router(app) {
    var api = require('./api')(app, requirements);
}

module.exports = router;
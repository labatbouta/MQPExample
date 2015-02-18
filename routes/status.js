/**
 * Created by lisabatbouta on 2/11/15.
 */
module.exports = function(app, reqs) {
    // --------- status of the server -----------------
    app.get('/status', function(req, res) {
        // a list of the external services used and their urls
        var services = {
            "jQuery": "https://code.jquery.com/jquery-2.1.1.min.js"
        };
        // update this as needed
        var service_count = 1;

        // service endpoints hit so far
        var hit_count = 0;

        // a status endpoint for checking the
        // health of the application
        var stats = {};
        stats["status"] = 200;
        stats["version"] = "1.0.0";
        stats["services"] = {};

        // get the status from each service
        for(var service in services) {
            if(services.hasOwnProperty(service)) {
                // preserve variable values using a tricky
                // scoping maneuver
                (function(serv, url) {
                    reqs.request(url, function(err, response, body) {
                        // if there was any error, send back a 500
                        if(!err) {
                            stats.services[serv] = { "endpoint" : url, "status" : response.statusCode };
                        } else {
                            stats.services[serv] = { "endpoint" : url, "status" : 500 };
                        }
                        hit_count++;
                        // after all services have been hit
                        if(hit_count == service_count) {
                            // send back the response
                            res.send(stats);
                        }
                    });
                })(service, services[service]);
            }
        }
    });
};
/*
 SimpleChatService is a node.js server that offers support for implementig scalable chats
 in  a SOA environment.    Messages persistence in REDIS or in a standard database.

 See README.txt for details. (c) Axiologic SaaS. Licensed: LGPL.

 PUT request to http://chatserver/{room uid}/message/
 GET requests on http://chatserver/{room uid}/<page_number>/<pageAmount>
 GET  requests on http://chatserver/{room uid}/count
*/

var journey = require('journey');

function putMessage(req, res, data) {
    console.log(data);
    res.send(200);
}

function getPage(req, res, roomId, pageNumber, pageLines) {
    res.send(200, {}, {room:roomId, page:pageNumber,lines:pageLines});
    //res.send('getPage: ' + req.params[0] + " PageNumber: " + req.params[1] + " PageCount: " + req.params[2]);
}

function count(req, res, roomId) {
    res.send(200, {}, {room:roomId});
    //res.send('count:' + req.params[0]);
}

//
// Create a Router
//
var router = new(journey.Router);

// Create the routing table
router.map(function () {
    this.root.bind(function (req, res) { res.send("Welcome") });
    this.get(/^\/(.+)\/([0-9]+)\/([0-9]+)/).bind(getPage);
    this.put(/^\/(.+)\/message/).bind(putMessage);
    this.get(/^\/(.+)\/count/).bind(count);

});

require('http').createServer(function (request, response) {
    var body = "";

    request.addListener('data', function (chunk) { body += chunk });
    request.addListener('end', function () {
        //
        // Dispatch the request to the router
        //
        router.handle(request, body, function (result) {
            response.writeHead(result.status, result.headers);
            response.end(result.body);
        });
    });
}).listen(8080);

/*
 SimpleChatService is a node.js server that offers support for implementig scalable chats
 in  a SOA environment.    Messages persistence in REDIS or in a standard database.

 See README.txt for details. (c) Axiologic SaaS. Licensed: LGPL.

 PUT request to http://chatserver/{room uid}/message/
 GET requests on http://chatserver/{room uid}/<page_number>/<pageAmount>
 GET  requests on http://chatserver/{room uid}/count
*/

var journey = require('journey');
var redis = require("redis"),
    client = redis.createClient(6379);

client.on("error", function (err) {
    console.log("Error " + err);
});


function putMessage(req, res,roomId, data) {
    console.log(data);
    res.send(200);
}

function addMessage(req, res, roomId, userName, message) {
    var msg= {room:roomId, user:userName,date:null,message:message};
    console.log(JSON.stringify(msg));

    client.lpush(roomId,JSON.stringify(msg),redis.print);
    res.send(200, {},msg);
}


function getPage(req, res, roomId, pageNumber, pageLines) {

    //client.lrange(roomId,pageNumber*pageLines,(pageNumber+1)*pageLines,redis.print);

    client.lrange(roomId,pageNumber*pageLines,(pageNumber+1)*pageLines,function (err, replies){
            console.log(replies.length + " replies:");
            replies.forEach(function (reply, i) {
                console.log("    " + i + ": " + reply);
            });
        }
    );
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
    this.get(/^add\/(.+)\/(.+)\/(.*)/).bind(addMessage);
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

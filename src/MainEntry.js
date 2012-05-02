/*
 SimpleChatService is a node.js server that offers support for implementig scalable chats
 in  a SOA environment. For messages persistence REDIS is used.

 See README.txt for details. (c) Axiologic SaaS. Licensed: LGPL.

 PUT request to http://chatserver/{room uid}/message/
 GET requests on http://chatserver/{room uid}/<page_number>/<pageAmount>
 GET requests on http://chatserver/{room uid}/count
*/

var journey = require('journey');
var redis = require("redis"),
    client = redis.createClient(6379);

client.on("error", function (err) {
    console.log("Error " + err);
});


function putMessage(req, res,roomId, data) {
    console.log(data);
    client.lpush(roomId,JSON.stringify(data),function(){
        count(null,res,roomId);
    });
}

function addMessage(req, res, roomId, userName, message, msgDate){
    var msg= {room:roomId, user:userName,date:msgDate,message:message};
    console.log(JSON.stringify(msg));
    client.lpush(roomId,JSON.stringify(msg),function(){
        count(null,res,roomId);
    });
}


function getPage(req, res, roomId, pageNumber, pageLines) {
    client.lrange(roomId,pageNumber*pageLines,(pageNumber+1)*pageLines,function (err, replies){
            var ret=null;
            replies.forEach(function (reply, i) {
                if(ret == null){
                    ret="[";
                }
                else{
                    ret+=",";
                }
                ret+=reply;
            });
            ret+="]";
            res.sendBody(ret);
        }
    );
}

function count(req, res, roomId) {
    client.llen(roomId,function(err, reply){
        console.log(err);
        console.log(reply);
        res.send(200, {}, reply);
    });
}

//
// Create a Router
//
var router = new(journey.Router);

// Create the routing table
router.map(function () {
    this.root.bind(function (req, res) { res.send("Welcome") });
    this.get(/^\/(.+)\/([0-9]+)\/([0-9]+)/).bind(getPage);
    this.get(/^add\/(.+)\/(.+)\/(.*)\/(.*)/).bind(addMessage); //tests/|debug only
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

SimpleChatService is a very simple node.js server that offers support for implementig scalable chats in a SOA environment. Messages persistence is performed by Redis.

The communication over HTTP will take place by calling:
- PUT request to "http://chatserver/{room uid}/message/" for adding a new chat message in a room
	{
	user   : "user name",
	date   : "message timestamp",
	message:String
	}

- GET request on "http://chatserver/{room uid}/<page>/<messagesPerPage>" returns all messages from a page
     This call returns a JSON like:
           [
            {user="Ionescu", date="5676567",message="Hello Popescu"},
            {user="Popescu", date="5676568",message="Hello Ionescu"}
           ]

- GET  requests on http://chatserver/{room uid}/count to request the number of available messages in a room


- TODO: PUT request to http://chatserver/{room uid}/archive for removing the room from the faster storage to a traditional database

Observations:
    - notifications about new messages arriving is not a concern for this server, a server like NotyServer must be used
    - Security is ensured by having randomly (long,hard to guess) generated room uids.

Dependencies: journey,redis


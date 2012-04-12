   		SimpleChatService is a node.js server that offers support for implementig scalable chats 
   in  a SOA environment 
   Messages persistence in REDIS or in a standard database.

The communication over HTTP will take place by calling:

- PUT request to http://chatserver/{room uid}/message/ for adding a new chat message in a room
	{
	user   : "user name"
	date   :"message timestamp"	
	text:String
	}
	
	The request is returning a messageOrder
- GET requests on http://chatserver/{room uid}?start=<start>&count<number> to request messages 
    - start could be TOP a number 
    - number could be -1 to return all messages after "start" or could be "NEWER" to return all 
    messages newer than "start" (in this case TOP should not be TOP or it will return all messages)
        
- PUT request to http://chatserver/{room uid}/archive for removing the room from the faster storage to a traditional database
    
  Security is ensured by having randomly (long,hard to guess) generated room uids.
  
  
   This call returns a JSON like:
   [
    {messageOrder="1",user="Ionescu", date="5676567",text="Hello"},
    {messageOrder="2",user="Popescu", date="5676568",text="Hello"}
   ]
   
- GET  requests on http://chatserver/{room uid}/count to request the number of available messages in a room


Observations: notifications about new messages arriving is not a concern for this server, a server like 
NotyServer must be used

Dependencies: json-streamer,
restler,... //http requets
https://github.com/DTrejo/json-streamify


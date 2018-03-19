const port = process.env.PORT || 10000;
const server= require("http").Server();

var io = require("socket.io")(server);

var usernames = [];
var allRooms ={};



io.on("connection", function(socket){
    console.log("someone is connected");
    
    
  socket.on("username", function(data){
        console.log("user is giving username:"+data);
        usernames.push(data);
        
        io.emit("usersjoined", usernames);
        
    })
    
    socket.on("joinroom", function(data){
        socket.emit("yourid", socket.id);
        socket.join(data);
        socket.myRoom =data;
        
        if(!allRooms[data]){
            allRooms[data] = [];
            
        }
   
        allRooms[data].push(socket.id);

        console.log(data);
        
    });

    
   
    
    socket.on("disconnect", function(){
        var index = allRooms[this.myRoom].indexOf(socket.id);
        allRooms[this.myRoom].splice(index, 1);
        io.to(this.myRoom).emit("createimage", allRooms[this.myRoom]);
        console.log("user has disconnected");
    });
});

server.listen(port, (err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("port is running");
})
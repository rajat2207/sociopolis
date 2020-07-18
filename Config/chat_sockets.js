module.exports.chatSockets=function(socketServer){
    let io=require('socket.io')(socketServer);

    //it recieves the connection request from the client side and establishes the connection from serverside
    io.sockets.on('connection',function(socket){
        console.log('new-connection received', socket.id);

        socket.on('disconnect',function(){
            console.log('Socket Disconnected...');
        });

        socket.on('join_room',function(data){
            console.log('joining request recieved', data);

            //put the user in the chatroom if it exists,else create the chatroom 
            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data);
        });
    });

    
}
class chatEngine{
    
    constructor(chatBoxId,userEmail){
        this.chatBox=$(`#${chatBoxId}`);
        this.userEmail=userEmail;

        //it emmits a connection request to the server
        this.socket=io.connect('http://localhost:5000');

        //after the connection is established with the server,the connection handler is fired
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){

        let self=this;

        this.socket.on('connect',function(){
            console.log('connection established using sockets....');

            self.socket.emit('join_room',{
                user_email : self.userEmail,
                chatroom: 'sociopolis'
            })

            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);
            })
        })
    }
}
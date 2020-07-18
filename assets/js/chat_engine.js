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

        self.socket.on('connect',function(){
            console.log('connection established using sockets....');

            self.socket.emit('join_room',{
                user_email : self.userEmail,
                chatroom: 'sociopolis'
            })

            self.socket.on('user_joined',function(data){
                console.log('a user joined',data);
            })
        });


        //send a message on clicking on the send message button
        $('#send_message').click(function(){
            let msg=$('chat-message-input').val();

            if(msg !=''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom:'sociopolis'
                });
            }
        });

        self.socket.on('recieve_message',function(data){
            console.log('message recieved',data.message);

            let newMessage = $('<li>');

            let messageType='other-message';

            if(data.user_email==self.userEmail){
                messageType='self-message';
            }

            newMessage.append($('<span>',{
                'html': data.message
            }));

            newMessage.append($('<sub>',{
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    }
}



$('#text').on('change',function(e){
    $('#typing').css({display:"flex"});
     let val=$('#text').val();
     console.log(val);
})



class chatEngine{
    constructor(chatBoxId,username,userId,user2){

        this.userId=userId
        this.chatroom=chatBoxId
        this.username=username;
        this.user2=user2;
        this.socket=io.connect('http://localhost:5000');
        if(this.username){
            this.connectionHandler();
        }
    }
    connectionHandler(){

        let self=this;
        if(self.user2){
            $(`.Id${self.user2}`).css({backgroundColor:"lightgrey"});
        }
          this.socket.on('connect',function(){
            let element=$("#chat-message-list")
            console.log(element);
            if(element.length){
                element.stop().animate({ scrollTop: $("#chat-message-list")[0].scrollHeight}, 1);
            }
          });
        
          self.socket.emit('setup',{
          userId:self.userId,
          name:self.username
          })


    //   send a message on clicking the send message button //
        if(self.chatroom){

        
          $('.send-Button').click(function(){
              $("#chat-message-list").stop().animate({ scrollTop: $("#chat-message-list")[0].scrollHeight}, 500);
                   let msg= $('#text').val();
                   $('#text').val("");
                   if(msg!=''){
                    console.log(msg);
                     self.socket.emit('send_message',{
                        username:self.username,
                        message:msg,
                        userId:self.userId,
                        chatroom:self.chatroom,
                    });
                };
          });

    //   send a message on clicking the  enter //
          $('#text').keypress(function(e){
              if(e.key==="Enter"){
                $("#chat-message-list").stop().animate({ scrollTop: $("#chat-message-list")[0].scrollHeight}, 500);
                let msg= $('#text').val();
                $('#text').val("");

                if(msg!=''){
                    let newMessage=$('<li>');  
                    let messageType='self-message';
                    newMessage.append($('<span>',{
                        'html':msg
                     }))
                     newMessage.addClass(messageType);
                     $('#chat-message-list').append(newMessage); 
                  self.socket.emit('send_message',{
                     username:self.username,
                     message:msg,
                     userId:self.userId,
                     chatroom:self.chatroom,
                 });
             };
              }
          })

     self.socket.on('receive_message',function(data){  
        if(data.data.chatroom!==self.chatroom) return ;
      $("#chat-message-list").stop().animate({ scrollTop: $("#chat-message-list")[0].scrollHeight}, 1);

      if(data.data.username!=self.username){
            $('.usernam').css({marginTop:'1rem',marginBottom:'-20px'});
            $('.status').css({display:"flex"});
      }

       let newMessage=$('<li>');
       let messageType='other-message';
       newMessage.append($('<span>',{
          'html':data.data.message
       }))

       newMessage.addClass(messageType);
       $('#chat-message-list').append(newMessage);
      }) 
        }
    }
}   


// to close search bar 
$('#page').click(function(){
    $('.searchResult').css({display:"none"})
    $('#close').css({display:"none"});
    $('#logo').css({display:"flex"})
    $('.loading').css({display:'none'});
    $('.search').val('');
})
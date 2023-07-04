const path=require('path');
const express=require('express');
const exp = require('constants');
const http=require('http');
const app= express();
const socketio=require('socket.io');
const {formatMessage} =require('./utils/message');
const {userjoin, getCurrentUser,userLeave,getRoomUsers} =require('./utils/users');
const botName='Chat Chord Bot'
const server=http.createServer(app);
const io=socketio(server);

const PORT= 7000 || process.env.PORT

//run when client connect room
io.on('connection', socket => {
    socket.on('Joinroom' , ( {username, room}) => {
        const user= userjoin(socket.id, username, room);
        socket.join(user.room);
         //welcome current user
        socket.emit('message',formatMessage(botName, 'Welcome to Chart Chords!'));

        //boradcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName,`${user.username} Join the Chat`) );
        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users:getRoomUsers(user.room)
        })
    });
    //listen for chatMessage
    socket.on('chatMessage', msg => {
        const user= getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg) );
    });
      //run when client disconnected
      socket.on('disconnect', () =>{
        const user= userLeave(socket.id);
        if(user) {
             io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
             //send users and room info
             io.to(user.room).emit('roomUsers', {
                 room:user.room,
                 users:getRoomUsers(user.room)
             })
        }
    });
});  

app.use(express.static(path.join(__dirname,'public')));
server.listen(PORT,() => {
    console.log(`Server is running on Port ${PORT}`);
})
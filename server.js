const express = require('express');
const path = require('path');
const http =require('http');
const socketio = require('socket.io');
// const { isObject } = require('util');
// const { EOF } = require('dns');

const fromatMessage = require('./public/utils/messages.js')
const {
    userJoin,
    getCurrentUser,
     userLeave,
     getRoomUsers   
    }  = require('./public/utils/users.js')
//to use app directly we are using server
const app = express();
const server = http.createServer(app);
const io = socketio(server);
//set static folder
app.use(express.static(path.join(__dirname,'public')))
const botName='admin'
//Run when clients connects
io.on('connection',socket => {
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id,username,room)
        socket.join(user.room)
        // console.log('New Connection...');
     //emit will help to transfer event back and forth to server or to our main.js 
        socket.emit('message',fromatMessage(botName,'Or aa gya deshatgardi karne..'))
        //send when user connects 
        //difference between emit and broadcast is that it will send meassage to everyone except particular user
        socket.broadcast.to(user.room).emit('message',fromatMessage(botName,`${user.username} the great rehpadu entered the chat!`))

            //send user and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users: getRoomUsers(user.room)
        });
    })
    
    //Listen for chatMessage
    socket.on('chatMessage',msg=>{
        // console.log(msg);
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',fromatMessage(user.username,msg)); //this message will be printed on the console and to print it on app we can use react ,template engine :kendalbar, mustash
        //but i will use vanilla js
    });

    //runs when client disconnets
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id)
        if(user)
            {
                io.to(user.room).emit('message',fromatMessage(botName,`${user.username} ko tumne bgha dia...`))
            }        //io.emit() send to everyone
               //send user and room info
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users: getRoomUsers(user.room)
            });  
    });




});//we havent done anything in front end to show connection so let's do that




const PORT = 3000 || process.env.PORT;//what process.env.PORT does? It will chenck if we have enviroment variable named port and return it

// app.listen(PORT,()=>console.log(`Server listening at Port: ${PORT}`))
server.listen(PORT,()=>console.log(`Server listening at Port: ${PORT}`))

//Now we want my public folder as static folder to acess these files and forntend  
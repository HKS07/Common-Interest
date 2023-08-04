const chatForm =document.getElementById('chat-form')
const chatMessage =document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

const socket =io();// because of script tag of socket.io we are able to write this
//message from server

//Join chatroom
socket.emit('joinRoom',{username,room})

//get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)
})

socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    // where does this message came from?

    //scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
})
//now we will  send the message to server and then return back to dom
chatForm.addEventListener('submit',(e)=>{
    // we have to use e because when we submit it will directly  submit  to a file which we don't want
    e.preventDefault();

    //we now have to get text input
    const msg = e.target.elements.msg.value;//we are grabbing it by id (msg)
    //console.log(msg);
    //till now it is not submitting to server

    //Emit  message to server
    socket.emit('chatMessage',msg)
})

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username } <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    //now we will grab .chat-message and append div for any  new message
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM 
function outputRoomName(room) {
    roomName.innerText = room;
}

//add users to dom
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}
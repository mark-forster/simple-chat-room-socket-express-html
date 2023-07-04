const chatForm= document.getElementById('chatForm');
const chatMessage=document.querySelector('.chat-message');
const roomName= document.getElementById('room-name');
const userList= document.getElementById('users')
//get username and room from url
const {username , room} = Qs.parse(location.search , {
    ignoreQueryPrefix:true
});
console.log({username, room})
const socket= io(); 
//Join Chatroom
socket.emit('Joinroom', {username,room}) ;
//Get Room and users
    socket.on('roomUsers', ({room, users}) => {
        outPutRoomName(room);
        outPutUsers(users);
    })
//Message form server
socket.on('message', message =>{
        console.log(message);
        outpuMessage(message);
});


//message submit
chatForm.addEventListener('submit' , e => {
        e.preventDefault();

    const msg= e.target.elements.msg.value;
    //clear input message
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
    //emit Message to server
    socket.emit('chatMessage', msg);
});

//output message to Dom
function outpuMessage(message) {
    const div= document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p style="font-size:12px; padding-top: 5px;padding-left:5px;font-weight:bold;" class="meta">${message.username} <span>${message.time}</span></p>
    <p style="font-size:11px; margin-top:-10px;padding-left:5px;color:red !important" class="text">${message.text} </p>`;
    document.querySelector('.chat-message').appendChild(div);
}

//Add room name to DOM
function outPutRoomName(room){
    roomName.innerText= room;
}
//Users List
function outPutUsers(users) {
    userList.innerHTML=
    `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
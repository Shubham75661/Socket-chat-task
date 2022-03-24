import {useState} from 'react'
import Chat from './Components/Chat';
import './App.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');


function App() {
  const[username, SetUsername] = useState("");
  const[room, SetRoom] = useState("");
  const[viewChat, SetviewChat] = useState(false);

//Join the room
  const JoinRoom = () =>{
    if(username !== "" && room !== ""){
      const data = {room : room, username : username}
      socket.emit('join_room', data );
      SetviewChat(true);
    }
  }

  return (
    <div className="App">
      { !viewChat ?(
      <div className ="joinChatContainer">
        <h3>Join a chat room</h3>
        <input type= "text" placeholder="Username" onChange={(event) =>{
          SetUsername(event.target.value);
        }}/>
        <input type= "text" placeholder="Room ID" onChange={(event) =>{
          SetRoom(event.target.value);
        }}/>
        <button onClick={JoinRoom}>Join a room</button>
     </div>
      ) 
        :
      (
     <Chat socket={socket} username={username} room={room}/>
      )}
    </div>
  );
}

export default App;

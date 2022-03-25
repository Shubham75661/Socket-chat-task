
import { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import { v1 as uuidv1 } from 'uuid';

function Chat({socket, username, room}) {
    const [currentMessage, setcurrentMessage] = useState("");
    const [messageList, setmessageList] = useState([]);
    const [Media, setMedia] = useState("");

    
 //Sending Data
 const sendMessage = async () => {
     if(!Media){
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time:
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
            }
            await socket.emit("send_message", messageData);
            setmessageList((list) => [...list, messageData])
            setcurrentMessage("")
        }
    }else{
        const messageData = {
            room: room,
            author: username,
            media:Media.content,
            filename:Media.name,
            time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        }
        await socket.emit("send_file", messageData);
        setmessageList((list) => [...list, messageData])
        setcurrentMessage("")
        setMedia("");
    }
}


    useEffect(() => {
        socket.on("receive_message", (data) => {
            setmessageList((list) => [...list, data])
        });
      }, []);

  return (
    <div className ="chat-window">
        <div className="chat-header">
            <p>Live-chat</p>
        </div>

        <div className="chat-body">
            <ScrollToBottom className ="message-container">
                {messageList.map((currentmessage) => {
                    return (
                        <div key ={uuidv1()}className="message" id ={username !== currentmessage.author ? "you" : "other"}>
                            <div>
                                {currentmessage.media?<div className='image container'>
                                    <img src={currentmessage.media} alt="" width="200"></img>
                                    <p id='author'>{currentmessage.filename}</p>
                                </div>:null}
                                {currentmessage.message ?  <div className="message-content">
                                    <p>{currentmessage.message}</p>
                                </div>:null}
                               
                                <div className="message-meta">
                                    <p id='author'>{currentmessage.author}</p>
                                    <p id='time'>{currentmessage.time}</p>
                                    <p id='time'>{currentmessage.room}</p>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </ScrollToBottom>
        </div>

        <div className="chat-footer">
            <input type= "text" 
            placeholder="chat..." 
            onChange={(event) =>{
                setcurrentMessage(event.target.value);
            }}
            value ={currentMessage}/>
            <button onClick={sendMessage} className="newclass">Send</button>
            <input type="file" className="newclass" onChange={(e) =>{
                const file = e.target.files[0];
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function(){
                    setMedia({
                        content : reader.result,
                        name : file.name
                    })
                    
                }
                reader.onerror = function(error){
                    console.log(error);
                }
            }}/>
           
        </div>
    </div>
  )
};


export default Chat

import { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({socket, username, room}) {
    const [currentMessage, setcurrentMessage] = useState("");
    const [messageList, setmessageList] = useState([]);

    
 
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
          };

          await socket.emit("send_message", messageData);
          setmessageList((list) => [...list, messageData])
          setcurrentMessage("")
        }
    };

    socket.on('output_message', data =>{
        setmessageList((list) => [...list, data])
    })

    useEffect(() => {
        socket.on("receive_message", (data) => {
          setmessageList((list) => [...list, data])
        });
      }, [socket]);

  return (
    <div className ="chat-window">
        <div className="chat-header">
            <p>Live-chat</p>
        </div>

        <div className="chat-body">
            <ScrollToBottom className ="message-container">
                {messageList.map((currentmessage) => {
                    return (
                        <div key ={`${currentmessage.username}${currentmessage.message}`}className="message" id ={username !== currentmessage.author ? "you" : "other"}>
                            <div>
                                <div className="message-content">
                                    <p>{currentmessage.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id='author'>{currentmessage.author}</p>
                                    <p id='time'>{currentmessage.time}</p>
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
            <button onClick={sendMessage}>Send</button>
           
        </div>
    </div>
  )
}

export default Chat
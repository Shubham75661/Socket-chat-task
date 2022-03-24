import React from 'react'

function Messages({mainData, time, author}) {
  return (
    <div className="message">
        <div>
            <div className="message-content">
                <p>{mainData}</p>
            </div>
            <div className="message-meta">
                <p>{author}</p>
                <p>{time}</p>
            </div>
        </div>
    </div>
  )
}

export default Messages
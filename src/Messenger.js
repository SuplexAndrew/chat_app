import React, {useEffect, useRef, useState} from 'react';
import socketio from "socket.io-client";
import Message from "./Message";

const Messenger = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const socket = useRef(null)
    useEffect(() => {
        socket.current = socketio.connect("http://localhost:3001")
        const token = localStorage.getItem('chat-token')
        socket.current.emit('connection', token)
        socket.current.on('interval', (data) => console.log(`User on site ${data} minutes`))
        socket.current.on('getToken', (token) => localStorage.setItem('chat-token', token))
        socket.current.on('getMessages', (messages) => setMessages(messages))
        console.log(document.cookie)
    }, [])

    const HandlerClick = () => {
        socket.current.emit('chat message', message, localStorage.getItem('chat-token'))
        socket.current.on('message received', (data) => setMessages(data))
    }
    return (
        <div className="messenger">
            <h1>title</h1>
            <div className='chatmain'>
                {messages.map(item => <Message key={item.id} text={item.text} fromMe={item.sent_by_user}/>)}
            </div>
            <div className="input-group">
                <input type="text" value={message}
                       onChange={(event) => setMessage(event.target.value)}/>
                <input type='button' value='send' onClick={HandlerClick}/>
            </div>
        </div>
    );
};

export default Messenger;

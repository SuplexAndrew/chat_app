import React, {useEffect, useRef, useState} from 'react';
import socketio from "socket.io-client";
import Message from "./Message";

const Messenger = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const socket = useRef(null)
    const [settings, setSettings] = useState({
        user_message_color: "bg-primary text-black",
        operator_message_color: "border"
    })
    useEffect(() => {
        socket.current = socketio.connect("http://localhost:3001")
        const token = localStorage.getItem('chat-token')
        socket.current.emit('connection', token)
        socket.current.on('interval', (data) => console.log(`User on site ${data} minutes`))
        socket.current.on('getToken', (token) => localStorage.setItem('chat-token', token))
        socket.current.on('getSettings', (data) => setSettings(data))
        socket.current.on('getMessages', (messages) => setMessages(messages))
    }, [])

    const HandlerClick = () => {
        const m = {text: message, status_id: 1, sent_by_user: true}

        socket.current.emit('chat message', m, localStorage.getItem('chat-token'))
        setMessages([...messages, m])
        setMessage('')
        socket.current.on('message received', (data) => setTimeout(() => {
            setMessages(data)
        }), 2222 )
    }
    const HandlerKeyDown = (event) => {
        if (event.key === 'Enter') {
            HandlerClick()
            event.preventDefault();
        }
    }
    return (
        <div className="messenger" onKeyDown={HandlerKeyDown}>
            <h1>Chat with operator</h1>
            <div className='chatmain'>
                {messages.map(item =>
                    <Message key={item.id} text={item.text} status_id={item.status_id} settings={settings}
                             fromMe={item.sent_by_user}/>)}
            </div>
            <div className="input-group">
                <input className='inputField' type="text" value={message}
                       onChange={(event) => setMessage(event.target.value)}/>
                <input className='sendButton' type='button' value='send' onClick={HandlerClick}/>
            </div>
        </div>
    );
};

export default Messenger;

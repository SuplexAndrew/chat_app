import React, {useEffect, useState} from 'react';
import socketio from "socket.io-client";
import Message from "./Message";
import axios from "axios";
import ChatSidebar from "../Sidebar/ChatSidebar";


const Messenger = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const socket = socketio.connect("http://localhost:3001")
    const [userId, setUserId] = useState()
    const [settings, setSettings] = useState({
        user_message_color: "bg-primary text-black",
        operator_message_color: "border"
    })
    const fetchMessages = async (id) => {
        axios.get(`http://localhost:3001/api/getMessages/${id}`)
            .then(response => setMessages(response.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        socket.emit('operator_connection', token)
        socket.on('getMessages', (messages) => setMessages(messages))
    }, [socket])

    const HandlerClick = () => {
        const m = {text: message, status_id: 1, user_id: userId, sent_by_user: false}

        socket.emit('chat message', m, localStorage.getItem('chat-token'))
        setMessages([...messages, m])
        setMessage('')
        socket.on('message received', (data) => setTimeout(() => {
            setMessages(data)
        }), 2222)
    }
    const HandlerKeyDown = (event) => {
        if (event.key === 'Enter') {
            HandlerClick()
            event.preventDefault();
        }
    }
    return (
        <div>
            <div className='row'>
                <div className='col-sm-auto offset-sm-3'>
                    <div className="messenger" onKeyDown={HandlerKeyDown}>
                        <h1>Chat with clients</h1>
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
                </div>
                <div className='col-2'>
                    <ChatSidebar getMessages={fetchMessages} socket={socket} setUserId={setUserId}/>
                </div>
            </div>
        </div>
    );
};

export default Messenger;

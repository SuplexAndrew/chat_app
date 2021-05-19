import React, {useEffect, useState} from 'react';
import ChatbarTab from "./ChatbarTab";

const ChatSidebar = (props) => {
    const [messages, setMessages] = useState([])
    useEffect(() => {
        console.log(props.socket)
        props.socket?.on('getLastMessages', (data) => setMessages(data.slice(0, 5)))
    }, [props.socket])
    return (
        <div className='sidebar'>
            <h3>Dialogs</h3>
            {messages.map(i =>
                <ChatbarTab key={i.id}
                            text={i.text}
                            status_id={2}
                            time={i.time_}
                            userId={i.user_id}
                            setUserId={props.setUserId}
                            getMessages={props.getMessages}
                />)}
        </div>
    );
};

export default ChatSidebar;

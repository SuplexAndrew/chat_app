import React from 'react';

const ChatbarTab = (props) => {
    const onClick = () => {
        props.getMessages(props.userId)
        props.setUserId(props.userId)
    }
    const date = new Date(props.time);
    return (
        <div className='chatbartab' onClick={onClick}>
            <p>{'Id - ' + props.userId + ' : ' + props.text}</p>
            <p className='text-muted small'>{'time: ' + date.toLocaleString()}</p>
        </div>
    );
};

export default ChatbarTab;

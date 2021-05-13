import React from 'react';

const Message = (props) => {
    return (
        <div className={`my-1 d-flex flex-column ${props.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}>
            <div className={`rounded px-2 py-1 mw-50 ${props.fromMe ? 'bg-primary text-white' : 'border'}`}>
                {props.text}
            </div>
            <div className={`text-muted small ${props.fromMe ? 'text-right' : ''}`}>
                {props.fromMe ? 'You' : 'anon'}
            </div>
        </div>
    );
};

export default Message;

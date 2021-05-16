import React from 'react';

const status = ['Отправлено', 'Доставлено', 'Получено']

const Message = (props) => {
    return (
        <div className={`my-1 d-flex flex-column ${props.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}>
            <div className={`rounded px-2 py-1 mw-50 
            ${props.fromMe ? props.settings.user_message_color : props.settings.operator_message_color}`}>
                {props.text}
            </div>
            <div className={`text-muted small ${props.fromMe ? 'text-right' : ''}`}>
                {status[props.status_id - 1]}
            </div>
        </div>
    );
};

export default Message;

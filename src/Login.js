import React, {useState} from 'react';
import axios from "axios";

const Login = (props) => {
    const [name, setName] = useState('ivan')
    const [surname, setSurname] = useState('ivanov')
    const [password, setPassword] = useState('1234')
    async function LoginFetch (){
        let response = await axios.post('http://localhost:3001/user/login',
            {name: 'ivan', surname: 'ivanov', password: '1234'})
        props.login(response.data)
    }
    return (
        <div className='loginForm'>
            <h1>{props.user || 'hi'}</h1>
                <label>Name</label>
                <input type="text" id='name' value={name} onChange={e => setName(e.target.value)}/>
                <label>Surname</label>
                <input type="text" id='surname' value={surname} onChange={e => setSurname(e.target.value)}/>
                <label>Password</label>
                <input type="text" id='password' value={password} onChange={e => setPassword(e.target.value)}/>
                <input type="submit" name='Sign Up' onClick={LoginFetch}/>
        </div>
    );
};

export default Login;

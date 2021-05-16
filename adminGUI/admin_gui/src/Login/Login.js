import React, {useState} from 'react';
import axios from "axios";

const Login = (props) => {
    const [login, setLogin] = useState()
    const [password, setPassword] = useState()
    async function LoginFetch (){
        let response = await axios.post('http://localhost:3001/api/login',
            {login: login, password: password})
        if(response)
            props.login(response.data)
    }
    return (
        <div className='loginForm'>
            <h1>{props.user || 'hi'}</h1>
                <label>Login</label>
                <input type="text" id='name' value={login} onChange={e => setLogin(e.target.value)}/>
                <label>Password</label>
                <input type="text" id='password' value={password} onChange={e => setPassword(e.target.value)}/>
                <input type="submit" name='Sign Up' onClick={LoginFetch}/>
        </div>
    );
};

export default Login;

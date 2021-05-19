import './App.css';
import React, {useState} from "react";
import Messenger from "../Messenger/Messenger";
import Login from "../Login/Login";

function App() {
    const [user, setUser] = useState('user')
    return (
        <div className="app">
            {!user && <Login login={setUser} />}
            {user && <Messenger />}
        </div>
    );
}

export default App;
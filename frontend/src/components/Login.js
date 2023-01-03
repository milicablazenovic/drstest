import { useState } from "react";
import {useNavigate} from "react-router-dom";
import authService from "../services/auth.service";


export default function Login({isopen, onclose}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () =>{
        const login = JSON.stringify({
            email: email,
            password: password
        });console.log(login);
        fetch("http://127.0.0.1:5000/login", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: login,
   }).then((response) => response.json())
     .then((data) => {
       onclose();
     });
    }

    return(
        <div className="login">
            <form isOpen={isopen} onClose={onclose}>
                <h2>Log In</h2>
                    <input type="email" required value={email} placeholder="Enter your email:"
                        onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" required value={password} placeholder="Enter your password:"
                        onChange={(e) => setPassword(e.target.value)}></input>
                    <button type="submit" onClick={login}>Log In</button>
            </form>
        </div>
    );
}

/*const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const history = useHistory();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            await authService.login(email, password).then(() => {
                navigate("/");
                //history.push("/");
                window.location.reload();
            }, (err) => {
                console.log("[Login function]", err);
            });
        } catch(err){
            console.log("[Login function]",err);
        }
        
    }

    return ( 
        <div className="login">
            <form onSubmit={handleLogin}>
                <h2>Log In</h2>
                    <input type="email" required value={email} placeholder="Enter your email:"
                        onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" required value={password} placeholder="Enter your password:"
                        onChange={(e) => setPassword(e.target.value)}></input>
                    <button type="submit">Log In</button>
            </form>
        </div>
     );
}
 
export default Login;*/
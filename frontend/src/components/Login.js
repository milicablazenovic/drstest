import { useState } from "react";
import {useNavigate} from "react-router-dom";
import authService from "../services/auth.service";

const Login = () => {
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
 
export default Login;
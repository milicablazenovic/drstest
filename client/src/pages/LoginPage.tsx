import React, {useState} from "react";
import { Link } from "react-router-dom";
//import { useHistory } from "react-router-dom";
import httpClient from "../httpClient";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    //const history= useHistory();

    const logInUser = async () => {
        console.log(email, password);

        try{
            const response = await httpClient.post("//127.0.0.1:5000/login", {
                email, password
                });

            window.location.href = "/";
            //history.push("/");
        }
        catch(error: any){
            if(error.response.status === 401){
                alert("Invalid credentials");
            }
        }
        
        //console.log(response.data);

        // if(response.status == 200){
        //     window.location.href = "/";
        // }
        // else if(response.status == 401){
        //     console.log("Invalid credentials");
        // }
    };

    return ( 
        <div className="auth">
            <h2>Login</h2>
            <form>
                <div>
                    {/* <label>Email: </label> */}
                    <input type="text" value={email} 
                    onChange={(e) => setEmail(e.target.value)} placeholder="Email:"></input>
                </div>
                <div>
                    {/* <label>Password: </label> */}
                    <input type="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)} placeholder="Password:"></input>
                </div>
                {/* <p>Please check if your input is valid!</p> */}
                <button type="button" onClick={() => logInUser()}>Log In</button><br/>
                <span>You don't have an account?<br/><Link to="/register">Sign Up Here!</Link></span>
            </form>
        </div>
     );
};
 
export default LoginPage;
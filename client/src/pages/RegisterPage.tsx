import React, {useState} from "react";
import { Link } from "react-router-dom";
import httpClient from "../httpClient";

const RegisterPage: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [phone_num, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const registerUser = async () => {
        try{
            const response = await httpClient.post("//127.0.0.1:5000/register", {
                name, lastname,
                address, city,
                country, phone_num,
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
    };

    return ( 
        <div className="auth">
            <h2>Create an Account</h2>
            <form>
                <div>
                    <input type="text" required value={name} 
                        onChange={(e) => setName(e.target.value)} placeholder="Name:"></input>
                </div>
                <div>
                    <input type="text" required value={lastname}
                        onChange={(e) => setLastname(e.target.value)} placeholder="Lastname:"></input>
                </div>
                <div>
                    <input type="text" required value={address} 
                        onChange={(e) => setAddress(e.target.value)} placeholder="Address:"></input>
                </div>
                <div>
                    <input type="text" required value={city}
                        onChange={(e) => setCity(e.target.value)} placeholder="City:"></input>
                </div>
                <div>
                    <input type="text" required value={country} 
                        onChange={(e) => setCountry(e.target.value)} placeholder="Country:"></input>
                </div>
                <div>
                    <input type="text" required value={phone_num}
                        onChange={(e) => setPhone(e.target.value)} placeholder="Phone number:"></input>
                </div>
                <div>
                    <input type="text" required value={email} 
                    onChange={(e) => setEmail(e.target.value)} placeholder="Email:"></input>
                </div>
                <div>
                    <input type="password" required value={password} 
                    onChange={(e) => setPassword(e.target.value)} placeholder="Password:"></input>
                </div>
                {/* <p>Please check if your input is valid!</p> */}
                <button type="button" onClick={() => registerUser()}>Register</button><br/>
                <span>Do you have an account?<br/><Link to="/login">Login Here!</Link></span>
            </form>
        </div>
     );
};
 
export default RegisterPage;
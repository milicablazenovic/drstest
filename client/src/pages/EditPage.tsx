import { useState } from "react";
import httpClient from "../httpClient";

const EditPage: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [phone_num, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const editUser = async () => {
        
        try{
            const response = await httpClient.post("//127.0.0.1:5000/edit_user", {
                name, lastname,
                address, city,
                country, phone_num,
                email, password
                });

            window.location.href = "/";
        }
        catch(error: any){
            if(error.response.status === 401){
                alert("Invalid credentials");
            }
        }
        
    };
    
    return ( 
        <div className="auth">
            <h2>Edit Your Account</h2>
            <form>
                <div>
                    <label>Name: </label>
                    <input type="text" required value={name} 
                        onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div>
                    <label>Lastname: </label>
                    <input type="text" required value={lastname}
                        onChange={(e) => setLastname(e.target.value)}></input>
                </div>
                <div>
                    <label>Address: </label>
                    <input type="text" required value={address} 
                        onChange={(e) => setAddress(e.target.value)}></input>
                </div>
                <div>
                    <label>City: </label>
                    <input type="text" required value={city}
                        onChange={(e) => setCity(e.target.value)}></input>
                </div>
                <div>
                    <label>Country: </label>
                    <input type="text" required value={country} 
                        onChange={(e) => setCountry(e.target.value)}></input>
                </div>
                <div>
                    <label>Phone number: </label>
                    <input type="text" required value={phone_num}
                        onChange={(e) => setPhone(e.target.value)}></input>
                </div>
                <div>   
                    <label>Email: </label>
                    <input type="text" required value={email} 
                    onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" required value={password} 
                    onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <button onClick={() => editUser()}>Edit</button>
            </form>
        </div>
     );
}
 
export default EditPage;
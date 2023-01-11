import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
// import useFetch from '../useFetch';
import { Link } from "react-router-dom";
import authService from "../services/auth.service";

import ReactModal from 'react-modal'



function Register({isOpen, onClose}){
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [phone_num, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const addUser = () =>{
        const add_user = JSON.stringify({
            name: name,
            lastname: lastname,
            address: address,
            city: city,
            country: country,
            phone_num: phone_num,
            email: email,
            password: password,
          });
          console.log(add_user);
         fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: add_user,
    }).then((response) => response.json())
      .then((data) => {
        onClose();
      });

     
    };

    return(
        <div className="register">
            <h2>Sign Up</h2>
            <form onClose={onClose}>
            <label>Name: </label>
                <input type="text" required value={name} 
                    onChange={(err) => setName(err.target.value)}></input>
                <label>Lastname: </label>
                <input type="text" required value={lastname}
                    onChange={(err) => setLastname(err.target.value)}></input>
                <label>Address: </label>
                <input type="text" required value={address} 
                    onChange={(err) => setAddress(err.target.value)}></input>
                <label>City: </label>
                <input type="text" required value={city}
                    onChange={(err) => setCity(err.target.value)}></input>
                <label>Country: </label>
                <input type="text" required value={country} 
                    onChange={(err) => setCountry(err.target.value)}></input>
                <label>Phone number: </label>
                <input type="text" required value={phone_num}
                    onChange={(err) => setPhone(err.target.value)}></input>
                <label>Email: </label>
                <input type="email" required value={email} 
                    onChange={(err) => setEmail(err.target.value)}></input>
                <label>Password: </label>
                <input type="password" required value={password}
                    onChange={(err) => setPassword(err.target.value)}></input>
                <button type="submit" onClick={addUser}>Register</button>
            </form>
        </div>
    );
}

export default Register;


/*const Register = () => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try{
            await authService.register(name, lastname, address, city, 
                country, phone, email, password).then(
                    (response) => {
                        // chech for token and user already exists with 200
                        console.log("Sign up successfully", response);
                        navigate("/");
                        //history.push("/");
                        window.location.reload();
            },
            (err) => {
                console.log("[Register, handleRegister]", err);
            });
        } catch(err){
            console.log("[Register]", err);
        }
    }

    handleRegister();
        
    return ( 
        <div className="register">
            <h2>Sign Up</h2>
            <form onSubmit={handleRegister}>
            <label>Name: </label>
                <input type="text" required value={name} 
                    onChange={(err) => setName(err.target.value)}></input>
                <label>Lastname: </label>
                <input type="text" required value={lastname}
                    onChange={(err) => setLastname(err.target.value)}></input>
                <label>Address: </label>
                <input type="text" required value={address} 
                    onChange={(err) => setAddress(err.target.value)}></input>
                <label>City: </label>
                <input type="text" required value={city}
                    onChange={(err) => setCity(err.target.value)}></input>
                <label>Country: </label>
                <input type="text" required value={country} 
                    onChange={(err) => setCountry(err.target.value)}></input>
                <label>Phone number: </label>
                <input type="text" required value={phone}
                    onChange={(err) => setPhone(err.target.value)}></input>
                <label>Email: </label>
                <input type="email" required value={email} 
                    onChange={(err) => setEmail(err.target.value)}></input>
                <label>Password: </label>
                <input type="password" required value={password}
                    onChange={(err) => setPassword(err.target.value)}></input>
                <button type="submit">Register</button>
            </form>
        </div>
     );
}
 
export default Register;*/
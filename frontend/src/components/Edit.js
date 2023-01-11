import { useState } from "react";
import {useNavigate, useParams} from "react-router-dom";


const Edit = () => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEdit = (e) => {
        e.preventDefault();
        
    }
    
    return ( 
        <div className="edit">
            <h2>Edit your profile</h2>
            <form onSubmit={handleEdit}>
            <label>Name: </label>
                <input type="text" required value={name.value} 
                    onChange={(err) => setName(err.target.value)} placeholder={name.value}></input>
                <label>Lastname: </label>
                <input type="text" required value={lastname.value}
                    onChange={(err) => setLastname(err.target.value)}></input>
                <label>Address: </label>
                <input type="text" required value={address.value} 
                    onChange={(err) => setAddress(err.target.value)}></input>
                <label>City: </label>
                <input type="text" required value={city.value}
                    onChange={(err) => setCity(err.target.value)}></input>
                <label>Country: </label>
                <input type="text" required value={country.value} 
                    onChange={(err) => setCountry(err.target.value)}></input>
                <label>Phone number: </label>
                <input type="text" required value={phone.value}
                    onChange={(err) => setPhone(err.target.value)}></input>
                <label>Email: </label>
                <input type="email" required value={email.value} 
                    onChange={(err) => setEmail(err.target.value)}></input>
                <label>Password: </label>
                <input type="password" required value={password.value}
                    onChange={(err) => setPassword(err.target.value)}></input>
                <button type="submit">Edit</button>
            </form>
        </div>
     );
}
 
export default Edit;
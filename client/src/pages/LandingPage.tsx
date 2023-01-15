import React, {useState, useEffect} from "react";
import httpClient from "../httpClient";
import { Transaction, User } from "../types";

const LandingPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const logoutUser = async () => {
        const response = await httpClient.post("//127.0.0.1:5000/logout");
        window.location.href = "/";
    }

    useEffect(() => {
        (async() => {
            try{
                const response = await httpClient.get("//127.0.0.1:5000/@me");
                setUser(response.data);
            }
            catch(error){
                console.log("Not authenticated");
            }
        })();
    }, []);

    return (
        <div className="auth">
            <h2>Welcome to this Cryptocurrency Exchange</h2>

            {user != null ? (
                <div>
                    {/* <h2>Logged In</h2> */}
                    <h2>User: {user.name}</h2>

                    {/* <button type="button" onClick={logoutUser}>Log Out</button>
                    <a href="/edit_user"><button>Edit</button></a>
                    <a href="/add_transaction"><button>Trade with Cryptocurrencies</button></a> */}
                </div>
            ) : (
                <div>
                    <p>You are not logged in</p>
                    {/* <a href="/login"><button type="button">Login</button><br/></a>
                    <a href="/register"><button type="button">Register</button></a> */}
                </div>
            )}
            
        </div>
    );
};
 
export default LandingPage;
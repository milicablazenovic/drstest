import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import httpClient from "./httpClient";
import { User } from "./types";

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const logoutUser = async () => {
        //confirm("Do you really want to log out?", );
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
        <div>
            <nav className="navbar">
                {user != null ? (
                    <>
                    <h1>Cryptocurrency Market</h1>
                    <div className="links">
                        <Link to={"/"}>Home</Link>
                        <Link to={"/edit_user"}>Edit</Link>
                        <Link to={"/add_transaction"}>Trade</Link>
                        <Link to={"/logout"} onClick={logoutUser}>Log Out</Link>
                    </div>
                    </>
                ) : (
                    <>
                    <h1>Cryptocurrency Market</h1>
                    <div className="links">
                        <Link to={"/"}>Home</Link>
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/register"}>Sign Up</Link>
                    </div>
                    </>
                )

                }
                
            </nav>
        </div>
        
     );
}
 
export default Navbar;
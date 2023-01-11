import {Link} from "react-router-dom";
import {Login} from "./components/Login";

const Navbar = () => {
    //const { data: user, valutes: crypto, error, isLoading, isLogged } = useFetch('http://localhost:8000/login');

    return ( 
        <nav className="navbar">
            <h1>Cryptocurrency Exchanges</h1>
            <Link to="/login">Log In</Link>
            <Link to="/edit">Edit</Link>
            <Link to="/register">Sign Up</Link>
            {/* {isLogged && <div className="links">
                <Link to="/">Home</Link>
                <Link to="/logout">Log Out</Link>
                {!isLogged && <Link to="/login">Log In</Link>}
                {isLogged && <Link to="/edit">Edit</Link>}
                {isLogged && <Link to="/login">Log Out</Link>} 
                <Link to="/register">Register</Link>
                <Link to="/edit">Edit</Link>
                <Link to="/transactions">Buy a new Cryptocurrency</Link>
            </div>} */}
            {/* {!isLogged && <div className="links">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>} */}
        </nav>
     );
}
 
export default Navbar;
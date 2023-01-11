// import Navbar from './Navbar';
import {Routes, Route, Link} from 'react-router-dom';
// import NotFound from './NotFound';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Edit from './components/Edit';
// import CryptoDetails from './CryptoDetails';
// import UserDetails from './UserDetails';
import { useEffect, useState } from 'react';
import authService from './services/auth.service';
import Private from "./components/Private";
import BuyCrypto from "./components/BuyCrypto";
import NotFound from './components/NotFound';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if(user){
      setCurrentUser(user);
    }
  }, []);

  const logout = () => {
    authService.logout();
  };

  return (
    <div className="App">
      <nav className='navbar'>
        <h1>Cryptocurrency Exchanges</h1>
        <div>
            {/* ovo izbrisati kada se napravi validacija */}
            <Link to={"/"}>Home</Link>
            <Link to={"/edit"}>Edit</Link>

          {currentUser && (
            <div>
              <Link to={"/private"}>Private</Link>
            </div>
          )}
        </div>

        {currentUser ? (
          <div>
            <Link to={"/"}>Home</Link>
            <Link to={"/edit"}>Edit</Link>
            <Link to={"/add_transaction"}>Buy</Link>
            <a href='/login' onClick={logout}>Log Out</a>
          </div>
        ) : (
          <div>
              <Link to={"/login"}>Log In</Link>
              <Link to={"/register"}>Sign Up</Link>
          </div>
        )}
      </nav>

      <div className="container">
        <Routes>
          <Route exact path="/" element={<Home></Home>}/>
          <Route path="/private" element={<Private/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/add_transaction" element={<BuyCrypto/>}/>
          <Route path="/edit" element={<Edit/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
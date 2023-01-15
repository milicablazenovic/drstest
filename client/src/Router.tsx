import {BrowserRouter, Switch, Route, Link} from "react-router-dom";
import EditPage from "./pages/EditPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./Navbar";
//import './style.scss';
import BuyCryptoPage from "./pages/BuyCryptoPage";
import './index.css';

// function Layout(){
//     return (
//         <Navbar/>
//     );
// };

const Router = () => {
    return ( 
        <div className="App">
            <div className="container">
                <BrowserRouter>
                    <Navbar/>
                    <Switch>
                        <Route exact path="/" component={LandingPage}/>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/register" component={RegisterPage}/>
                        <Route path="/edit_user" component={EditPage}/>
                        <Route path="/add_transaction" component={BuyCryptoPage}/>
                        <Route component={NotFound}/>
                    </Switch>
                </BrowserRouter>
            </div>
        </div>
     );
}

export default Router;
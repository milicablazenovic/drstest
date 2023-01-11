import React from "react";
import Navbar from "./Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BuyCryptoPage from "./pages/BuyCryptoPage";
import EditPage from "./pages/EditPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";

function App(){

    // return(
    //     <div>
    //         <Navbar/>
    //         <Routes></Routes>
    //     </div>
    // );

    return ( 
        <div className="App">
            <div className="container">
                <BrowserRouter>
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

export default App;
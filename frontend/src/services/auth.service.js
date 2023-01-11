import axios from "axios";

const API_URL = "/api";

const register = (name, lastname, address, city, country, phone, email, password) => {
    return axios
        .post(API_URL+"/register", {
            name, lastname, 
            address, city, 
            country, phone,
            email, password
        }).then((response) => {
            if(response.data.accessToken){
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const login = (email,password) => {
    return axios
        .post(API_URL+"/login", {
            email,
            password
        }).then((response) => {
            if(response.data.accessToken){
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const getSelectedCrypto = () => {
    // da se dobije ta kriptovaluta ???
    return JSON.parse(localStorage.getItem("transaction"));
};

const buyCryptos = (cryptoName, cryptoAmount,cryptoPrice) => {
    return axios
        .post(API_URL + "/add_transaction", {
            cryptoName, cryptoAmount,cryptoPrice
        }).then((response) => {
            if(response.data.accessToken){
                // da se doda ta kriptovaluta ???
                localStorage.setItem("transaction", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const getPortfolio = () => {

};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    buyCryptos,
    getSelectedCrypto,
    getPortfolio
};

export default authService;
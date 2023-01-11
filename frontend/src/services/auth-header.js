export default function authHeader(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(user && user.accessToken){
        return {"access_token" : user.accessToken};
    }
    else{
        return {};
    }
} 
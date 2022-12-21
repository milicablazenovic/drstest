import { useState, useEffect } from "react";
import postService from "../services/post.service";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [privatePosts, setPrivatePosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        postService.getAllPrivatePosts().then(
            (response) => {
                setPrivatePosts(response.data);
            },
            (err) => {
                console.log("[Private] ", err.response);

                // invalid token, odnosno if invalid token expires
                if(err.response && err.response.status === 403){
                    authService.logout();
                    navigate("/login");
                    //history.push("/login");
                    window.location.reload();
                }
            }
        )
    }, []);

    return ( 
        <div>
            <h3>{privatePosts.map((post) => post.content)}</h3>
        </div>
     );
}
 
export default Home;
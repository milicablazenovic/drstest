// import UserCryptoList from "../UserCryptoList";
import postService from "../services/post.service";
import { useEffect, useState } from "react";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [shop, setShop] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        postService.getAllPublicPosts().then(
            (response) => {
            setPosts(response.data);
        },
            (error) => {
                console.log("[Home] ", error);
                //alert('Something went wrong');
            }
        );
    }, []);

    const handleButtonBuy = (e) => {
        e.preventDefault();

        try{
            navigate("/add_transaction");
        } catch(err){
            console.log("[Buy function] ", err);
        }
    }
    
    return ( 
        <div className="home">
            <h2>Your Cryptocurrency List</h2><br/>
            {(posts && posts!="" && posts!=undefined) ? posts.map((post) => (
                <div>{post.content}</div>
            ))
            : (
                <div>
                    <p><b>You don't have any Cryptocurrency in your List!</b></p><br/><br/>
                    <p>You are not logged in</p><br/>
                    <p>Click here to check our Market and buy Cryptocurrency!</p><br/>
                    <form onSubmit={handleButtonBuy}>
                        <button type="sumbit">Buy</button>
                    </form>
                </div>
            )}
        </div>
     );
};
 
export default Home;
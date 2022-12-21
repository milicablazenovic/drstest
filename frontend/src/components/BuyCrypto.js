import { useState } from "react";
import {useNavigate} from "react-router-dom";
import authService from "../services/auth.service";

const Login = () => {
    const [cryptoId, setCryptoId] = useState(0);
    const [cryptoName, setCryptoName] = useState('');
    const [cryptoSymbol, setCryptoSymbol] = useState('');
    const [cryptoType, setCryptoType] = useState(0);
    const [cryptoAmount, setCryptoAmount] = useState(0);
    const [cryptoTimeTransacted, setCryptoTimeTransacted] = useState(Date);
    const [cryptoTimeCreated, setCryptoTimeCreated] = useState(Date);
    const [cryptoPrice, setCryptoPrice] = useState(0.0);
    const [cryptoNoOfCoins, setCryptoNoOfCoins] = useState(0.0);
    //const history = useHistory();

    const navigate = useNavigate();

    const handleBuy = async (e) => {
        e.preventDefault();

        try{
            await authService.buyCryptos(cryptoName, cryptoAmount,cryptoPrice).then(() => {
                navigate("/");
                //history.push("/");
                window.location.reload();
            }, (err) => {
                console.log("[BuyCrypto/Buy function]", err);
            });
        } catch(err){
            console.log("[BuyCrypto/Buy function]",err);
        }
        
    }

    return ( 
        <div className="buyCrypto">
            <form onSubmit={handleBuy}>
                <h2>Buy Cryptocurrencies</h2>
                    <label>Choose the Cryptocurrency: </label>
                    <select value={cryptoName} onChange={(e) => setCryptoName(e.target.value)}>
                        <option value="Bitcoin">Bitcoin</option>
                        <option value="Solana">Solana</option>
                        <option value="Chainlink">Chainlink</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Cardano">Cardano</option>
                        <option value="Decentraland">Decentraland</option>
                        <option value="Dogecoin">Dogecoin</option>
                        <option value="Litecoin">Litecoin</option>
                        <option value="Polkadot">Polkadot</option>
                    </select>
                    <input type="number" required value={cryptoAmount} placeholder="Enter the amount you want"
                        onChange={(e) => setCryptoAmount(e.target.value)}></input>
                    <label>That would cost:</label>
                    {/* treba dodati neku funkciju koja ce izracunati cijenu */}
                    <input type="number" value={cryptoPrice} placeholder={cryptoPrice}
                        onChange={(e) => setCryptoPrice(e.target.value)}></input>
                    <button type="submit">Buy</button>
            </form>
        </div>
     );
}
 
export default Login;
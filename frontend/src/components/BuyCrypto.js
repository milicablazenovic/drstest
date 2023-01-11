import { useState } from "react";
import {useNavigate} from "react-router-dom";
import authService from "../services/auth.service";



export default function AddTransaction({isOpen, onClose}){
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState('');

    /*function checkSymbol(name){
        if(name == 'Bitcoin')
            setSymbol('BTC')
    }*/

    const addTransaction = () => {
        const payload = JSON.stringify({
          name: name,
          symbol: symbol,
          type: type,
          amount: amount * 100,
          time_created: Date.now() / 1000,
          time_transacted: Date.parse(transactionDate) / 1000
        });
        console.log(payload);
        fetch("http://127.0.0.1:5000/add_transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        })
          .then((response) => response.json())
          .then((data) => {
            onClose();
          });
      };

      return ( 
        <div className="buyCrypto">
            <form isOpen={isOpen} onClose={onClose}>
                <h2>Buy Cryptocurrencies</h2>
                    <label>Choose the Cryptocurrency: </label>
                    <select value={name} onChange={(e) => setName(e.target.value)} >
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
                    <input type="text" required value={symbol} placeholder="Enter the crypto symbol"
                        onChange={(e) => setSymbol(e.target.value)}></input>
                    <label>Enter amount: </label>
                    <input type="number" required value={amount} placeholder="Enter the amount you want"
                        onChange={(e) => setAmount(e.target.value)}></input>
                    <label>Enter type(1 for buy, 2 for sell)</label>
                    <input type="number" required value={type} placeholder="1-Buy Crypto / 2-Sell Crypto"
                        onChange={(e) => setType(e.target.value)}></input>
                    <label>Date:</label>
                    <input type="date" required value={transactionDate} placeholder="1-Buy Crypto / 2-Sell Crypto"
                        onChange={(e) => setTransactionDate(e.target.value)}></input>
                        
                    <button type="submit" onClick={addTransaction}>Buy</button>
            </form>
        </div>
     );
}



/*const Login = () => {
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
                    <label>That would cost:</label>*/
                    {/* treba dodati neku funkciju koja ce izracunati cijenu */}
                    /*<input type="number" value={cryptoPrice} placeholder={cryptoPrice}
                        onChange={(e) => setCryptoPrice(e.target.value)}></input>
                    <button type="submit">Buy</button>
            </form>
        </div>
     );
}
 
export default Login;*/
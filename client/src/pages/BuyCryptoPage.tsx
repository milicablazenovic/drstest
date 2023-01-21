import React, { useState } from "react";
import httpClient from "../httpClient";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { timeStamp } from "console";

const BuyCryptoPage: React.FC = () => {
  const [type, setType] = useState<string | number>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [amount, setAmount] = useState<string | number>("");
  const [transactionDate, setTransactionDate] = React.useState<null | Date>();
  const [transactionCreated, setTransactionCreated] = React.useState<null | Date>();
  const [purchasedAt, setPurchasedAt] = useState<string | number>(1);
  const [no_of_coins, setNoOfCoins] = useState<string | number>(1);

  const buyCrypto = async () => {
    const kolicina = Number(amount);
    setNoOfCoins((kolicina * 100) / Number(purchasedAt));

    try {
      console.log("request", {
        name, symbol, amount: Number(amount) * 100,
        type, time_transacted: transactionDate!.getTime() / 1000,
        time_created: Date.now() / 1000, price_purchased_at: purchasedAt,
        no_of_coins: no_of_coins,
      });

      const response = await httpClient.post(
        "//drsapi:5000/add_transaction",
        {
          name, symbol, amount: Number(amount) * 100,
          type, time_transacted: transactionDate!.getTime() / 1000,
          time_created: Date.now() / 1000, price_purchased_at: purchasedAt,
          no_of_coins: no_of_coins,
        }
      );

      alert("Successfully purchased!");
      window.location.href = "/";
    } catch (error: any) {
      alert("Please check if you entered everything correctly.");
      if (error.response.status === 401) {
        alert("Unauthorized!");
      }
      
    }
  };

  return (
    <div className="auth">
      <form>
        <h2>Trade with your Cryptos</h2>
        <input
          type="text" required value={name} placeholder="Enter the Cryptocurrency's name: "
          onChange={(e) => setName(e.target.value)}></input> <br />
        <input
          type="text"
          required
          value={symbol}
          placeholder="Enter the Crypto symbol: "
          onChange={(e) => setSymbol(e.target.value.toLocaleUpperCase())}
        ></input>
        <br />
        <input
          type="number"
          required
          value={amount}
          placeholder="Amount: "
          onChange={(e) => setAmount(e.target.value)}
        ></input>
        <br />
        <input
          type="number"
          required
          value={type}
          placeholder="Enter 1 for Buying / 0 for Selling Crypto :"
          onChange={(e) => setType(e.target.value)}
        ></input>
        <br />
        <ReactDatePicker
          dateFormat="dd/MM/yyyy"
          required
          selected={transactionDate} placeholderText="Select the Date: "
          onChange={(e) => setTransactionDate(e)}
        ></ReactDatePicker>
        <br />
        {/* <input type="time" required value={transactionCreated}></input> */}
        <button type="button" onClick={() => buyCrypto()}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default BuyCryptoPage;

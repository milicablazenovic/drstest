import { useState, useEffect } from "react";
import httpClient from "../httpClient";

export default function AllTransactions({ transactions, removeFunc }) {
  // Create a state variable to store the filtered transactions
  const [transactionWithFilters, setTransactionWithFilters] =
    useState(transactions);

  // Listen to changes in transactions and update transactionWithFilters accordingly
  useEffect(() => {
    setTransactionWithFilters(transactions);
  }, [transactions]);

  // Function to handle filter changes
  const applyFilter = (symbol) => {
    // Filter the transactions array based on the symbol provided
    setTransactionWithFilters(
      transactions.filter((value) => value["symbol"].includes(symbol))
    );
    console.log("first", transactionWithFilters);
  };

  // Function to delete a transaction from the server
  const deleteTransaction = async (id) => {
    try {
      const response = await httpClient.delete(
        "//127.0.0.1:5000/delete_transaction",
        {
          data: {
            id: id,
          },
        }
      );
    } catch (error) {
      console.log("Not authenticated");
    }
  };

  return (
    <div>
      <div className="row">
        <h1>All transactions</h1>
        <select
          name="filter"
          id="filter"
          onChange={(e) => applyFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="LINK">Chainlink (LINK)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="ADA">Cardano (ADA)</option>
          <option value="MANA">Decentraland (MANA)</option>
          <option value="DOGE">Dogecoin (DOGE)</option>
          <option value="LTC">Litecoin (LTC)</option>
          <option value="DOT">Polkadot (DOT)</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Currency</th>
            <th>Amount</th>
            <th>Number of coins</th>
            <th>Price</th>
            <th>Time of transaction</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactionWithFilters.map((item) => {
            return (
              <tr key={(Math.random() + 1).toString(36).substring(7)}>
                <td>{item["id"]}</td>
                <td>{item["name"]}</td>
                <td>{item["symbol"]}</td>
                <td>${item["amount"]}</td>
                <td>{item["no_of_coins"]}</td>
                <td>${item["price_purchased_at"]}</td>
                <td>{item["time_transacted"]}</td>
                <td>{item["type"] == 1 ? "Bought" : "Sold"}</td>
                <td>
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      deleteTransaction(item["id"]);
                      removeFunc(item["id"]);
                    }}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

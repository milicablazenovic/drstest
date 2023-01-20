import React, { useState, useEffect, useRef } from "react";
import AllTransactions from "../components/AllTransactions";
import Portfolio from "../components/Portfolio";
import httpClient from "../httpClient";
import { User } from "../types";

const LandingPage: React.FC = () => {
  // State for user data
  const [user, setUser] = useState<User | null>(null);
  // State for transaction data
  const [transactions, setTransactions] = useState([]);
  // State for portfolio data
  const [portfolio, setPortfolio] = useState([]);
  // State for flag to determine whether portfolio data should be updated
  const [shouldUpdatePortfolio, setShouldUpdatePortfolio] = useState(false);

  // Function for removing a transaction from the transaction list
  const removeFromList = (id: number) => {
    // Confirm with user before deleting
    let shouldDelete = window.confirm(
      "Are you sure you want to delete transaction " + id + "?"
    );
    if (shouldDelete) {
      // Remove transaction from state
      setTransactions(
        transactions.filter(function (value, index, arr) {
          console.log("value", value);
          return value["id"] != id;
        })
      );
      // Update the portfolio data
      setShouldUpdatePortfolio(!shouldUpdatePortfolio);
    }
  };

  // Fetch user and transaction data on initial render
  useEffect(() => {
    (async () => {
      try {
        if (!user) {
          const response = await httpClient.get("//127.0.0.1:5000/@me");
          setUser(response.data);
        }
        const responseTransactions = await httpClient.get(
          "//127.0.0.1:5000/get_all_transactions"
        );
        setTransactions(responseTransactions.data);

        const responsePortfolio = await httpClient.get(
          "//127.0.0.1:5000/get_portfolio"
        );
        setPortfolio(responsePortfolio.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, []);

  // Fetch updated portfolio data when flag is set
  useEffect(() => {
    (async () => {
      try {
        const responsePortfolio = await httpClient.get(
          "//127.0.0.1:5000/get_portfolio"
        );
        setPortfolio(responsePortfolio.data);
      } catch (error) {
        console.log("Not authenticated");
      }
    })();
  }, [shouldUpdatePortfolio]);

  return (
    <>
      <div className="auth">
        {user != null ? (
          <div>
            <h2>
              Hello <span>{user.name}</span>!
              <br />
              Welcome to this Cryptocurrency Exchange
            </h2>
          </div>
        ) : (
          <div>
            <h2>Welcome to this Cryptocurrency Exchange! Please, sing in.</h2>
          </div>
        )}
      </div>
      {user && (
        <div className="container">
          <div className="">
            {/* Pass transactions and remove function to AllTransactions component */}
            <AllTransactions
              transactions={transactions}
              removeFunc={removeFromList}
            />
            {/* Pass portfolio and transactions data to Portfolio component */}
            <Portfolio portfolio={portfolio} transactions={transactions} />
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;

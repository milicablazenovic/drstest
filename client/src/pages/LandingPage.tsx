import React, { useState, useEffect, useRef } from "react";
import AllTransactions from "../components/AllTransactions";
import Portfolio from "../components/Portfolio";
import httpClient from "../httpClient";
import { User } from "../types";

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [shouldUpdatePortfolio, setShouldUpdatePortfolio] = useState(false);

  const removeFromList = (id: number) => {
    let shouldDelete = window.confirm(
      "Are you sure you want to delete transaction " + id + "?"
    );
    shouldDelete &&
      setTransactions(
        transactions.filter(function (value, index, arr) {
          console.log("value", value);
          return value["id"] != id;
        })
      );
    setShouldUpdatePortfolio(!shouldUpdatePortfolio);
  };

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
              Hello <span>{user.name}</span>
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
            <AllTransactions
              transactions={transactions}
              removeFunc={removeFromList}
            />
            <Portfolio portfolio={portfolio} transactions={transactions} />
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;

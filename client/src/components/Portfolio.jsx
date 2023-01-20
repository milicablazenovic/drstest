import { useState } from "react";

export default function Portfolio({ portfolio, transactions }) {
  let totalProf = 0.0;
  let totalPortoflioValue = 0.0;

  const getProfit = (transactions, symbol) => {
    let totalProf = 0.0;

    transactions.forEach((element) => {
      if (element["type"] == 1) {
        if (element["symbol"] == symbol)
          totalProf += element["no_of_coins"] * element["price_purchased_at"];
      } else {
        if (element["symbol"] == symbol)
          totalProf -= element["no_of_coins"] * element["price_purchased_at"];
      }
    });

    return totalProf;
  };

  return (
    <div className="row portfolio">
      <div>
        <h1>Your portfolio</h1>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Live price (USD)</th>
              <th>You own (Crypto)</th>
              <th>You own (US Dollar)</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => {
              item["profit"] =
                item["coins"] * item["live_price"] -
                getProfit(transactions, item["symbol"]);

              totalPortoflioValue += item["coins"] * item["live_price"];
              totalProf += item["profit"];

              return (
                <tr key={(Math.random() + 1).toString(36).substring(7)}>
                  <td>{item["symbol"]}</td>
                  <td>{item["live_price"]}</td>
                  <td>{item["coins"]}</td>
                  <td>${(item["coins"] * item["live_price"]).toFixed(2)}</td>
                  <td className={item["profit"] >= 0 ? "gain" : "loss"}>
                    ${item["profit"].toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="portfolioHeader">
          Total portfolio value (USD):
          <br />
          <span className={totalPortoflioValue >= 0 ? "gain" : "loss"}>
            ${totalPortoflioValue.toFixed(2)}
          </span>
        </h3>
        <h3 className="portfolioHeader">
          Total profit (USD):
          <br />
          <span className={totalProf >= 0 ? "gain" : "loss"}>
            ${totalProf.toFixed(2)}
          </span>
        </h3>
      </div>
    </div>
  );
}

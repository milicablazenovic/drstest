import { useState, useEffect } from "react";
import httpClient from "../httpClient";

export default function AllTransactions({ transactions, removeFunc }) {
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
      <h1>All transactions</h1>
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
          {transactions.map((item) => {
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

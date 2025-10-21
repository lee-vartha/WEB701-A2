// importing necessary modules and components
import React, { useState, useEffect } from "react";
import API from "../api";


// creating the function to render the beneficiary dashboards
function BeneficiaryDashboard({ user, setUser }) {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");
  const [balance, setBalance] = useState(user?.tokenBalance || 5);

  // Load products and balance
  useEffect(() => {
    // get the products and the user balance
    API.get("/products").then((res) => setProducts(res.data));
    API.get("/users/me")
    // set the balance from the user data
      .then((res) => setBalance(res.data.tokenBalance))
      .catch(() => setBalance(5));
  }, []);

  // function to buy a product
const buy = async (id) => {
    try {
      // get the product id and post to the spend endpoint
      const res = await API.post("/tokens/spend", { productId: id });
      setMsg(res.data.msg);
      setBalance(res.data.balance); // update balance
      const updated = await API.get("/products");
      setProducts(updated.data);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Products</h2>

      <p className="mb-4 text-lg">
        🎟 <strong>Token Balance:</strong> {balance}
      </p>

      {products.length === 0 ? (
        <p className="text-gray-400">No products available yet.</p>
      ) : (
        <ul className="bg-white text-black rounded shadow divide-y">
          {products.map((p) => (
            <li
              key={p._id}
              className="p-3 flex justify-between items-center"
            >
              <span>
                <strong>{p.name}</strong> — {p.description} ({p.cost} tokens)
              </span>
              <button
                onClick={() => buy(p._id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Buy
              </button>
            </li>
          ))}
        </ul>
      )}

      {msg && <p className="mt-4 text-blue-400">{msg}</p>}
    </div>
  );
}

export default BeneficiaryDashboard;

import React, {useEffect, useState} from "react";
import Toast from "../components/Toast";

export default function AdminDashboard() {
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [toastMsg, setToastMsg] = useState("");
    const [tokenAmount, setTokenAmount] = useState(0);
    const [selectedUser, setSelectedUser] = useState("");

    const API_BASE = "http://localhost:5000/api";

    useEffect(() => {
        fetchUsers();
        fetchProducts();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch(`${API_BASE}/users`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        if (res.ok) setUsers(data);
    }

    const fetchProducts = async() => {
        const res = await fetch(`${API_BASE}/products`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        if (res.ok) setProducts(data);
    };

    const deleteUser = async (id) => {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${token}`},
        });
        if (res.ok) {
            setToastMsg("User deleted");
            fetchUsers();
        } else {
            const data = await res.json();
            setToastMsg(data.msg || "Failed to delete meal");
        }
    };

        const deleteProduct = async (id) => {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${token}`},
        });
        if (res.ok) {
            setToastMsg("Meal deleted");
            fetchProducts();
        } else {
            const data = await res.json();
            setToastMsg(data.msg || "Failed to delete product");
        }
    };

    const allocateTokens = async () => {
        if (!selectedUser || !tokenAmount) return;
        const res = await fetch(`${API_BASE}/tokens/allocate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({userId: selectedUser, amount: tokenAmount}),
        });
        const data = await res.json();
        if (res.ok) {
            setToastMsg(`Allocated ${tokenAmount} tokens.`);
            setTokenAmount(0);
            setSelectedUser("");
            fetchUsers();
        } else setToastMsg(data.msg || "Error allocating tokens");

    };

    return (
        <div className="min-h-screen bg-[#1f1f1f] text-[#d6d6d6] p-10 font-serif">
            <h1 className="text-4xl text-[#c6b88a] md-10">Admin Dashboard</h1>

            <section className="mb-10">
                <h2 className="text-2xl text-[#2eb4a2] mb-4">Manage Users</h2>
                <div className="overflow-x-auto border border-gray-700 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-[#242424]">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Tokens</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-t border-gray-700">
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.role}</td>
                                    <td className="p-3">{u.tokens}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => deleteUser(u._id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                        Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* products */}
                <section className="mb-10">
                <h2 className="text-2xl text-[#2eb4a2] mb-4">Manage Meals</h2>
                <div className="overflow-x-auto border border-gray-700 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-[#242424]">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Vendor</th>
                                <th className="p-3">Tokens</th>
                                <th className="p-3">Date Created</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id} className="border-t border-gray-700">
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">{p.vendor}</td>
                                    <td className="p-3">{p.tokens}</td>
                                    <td className="p-3 text-gray-400">
                                        {new Date(p.createdAt).toLocaleDateString('en-NZ', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => deleteProduct(p._id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                        Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* tokens */}
            <section>
                <h2 className="text-2xl text-[#2eb4a2] mb-4">Allocate Tokens</h2>
                <div className="flex gap-4 items-center">
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="bg-transparent border border-gray-600 p-2 rounded-md"
                    >
                        <option value="">Select User</option>
                        {users 
                            .filter((u) => u.role === "beneficiary")
                            .map((u) => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.email})
                                </option>
                            ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Tokens"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(e.target.value)}
                        className="bg-transparent border border-gray-600 p-2 rounded-md w-32"
                    ></input>

                    <button
                        onClick={allocateTokens}
                        className="border border-[#2eb4a2] px-4 py-2 text-[#2eb4a2] rounded-md hover:bg-[#2eb4a2] hover:text-black transition"
                    >
                    Allocate
                    </button>
                </div>
            </section>
                {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        </div>
    )

}
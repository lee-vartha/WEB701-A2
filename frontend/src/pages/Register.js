// importing necessary modules and components
import React, { useState } from 'react';
import API from '../api';

// function to register a new user
function Register({ setUser, setActiveTab }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'beneficiary' });
  const [msg, setMsg] = useState('');

  // handling form submission
  const handleSubmit = async () => {
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setActiveTab(res.data.user.role === "member" ? "member" : "beneficiary");
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="bg-white text-black shadow-lg rounded-xl p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <input className="w-full border p-2 mb-3 rounded"
        placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="w-full border p-2 mb-3 rounded"
        placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" className="w-full border p-2 mb-3 rounded"
        placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <select className="w-full border p-2 mb-3 rounded"
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="beneficiary">Beneficiary</option>
        <option value="member">Member</option>
      </select>
      <button onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Register
      </button>
      <p className="text-center text-red-500 mt-3">{msg}</p>
    </div>
  );
}

export default Register;

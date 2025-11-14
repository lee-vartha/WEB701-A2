import React, {useContext, useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Toast from "../components/Toast";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [toastMsg, setToastMsg] = useState("");
    const {setIsLoggedIn, setUsername} = useContext(AuthContext);
    const navigate = useNavigate();
    const API = "http://localhost:5000/api/auth";
    
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({name, email, password, role}),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.name);
                localStorage.setItem("role", data.user.role);

                setIsLoggedIn(true);
                setUsername(data.user.name);
                setRole(data.user.role);
                setToastMsg("Account created successfully!");

                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 1500);
            } else {
                setToastMsg(data.message || "Register failed. Try again");
            }
        } catch (err) {
            setToastMsg("Server error. Please try again later.")
        }
    };

  return (
    <div className="min-h-screen bg-[#1f1f1f] flex flex-col items-center justify-center text-[#d6d6d6] font-serif">
      <h1 className="text-4xl text-[#c6b88a] mb-12 pt-12">Register</h1>

    <form onSubmit={handleRegister} className="flex flex-col gap-4 w-[300px] border-gray-800">
        <label>Name</label>
        <input
            type="text"
            placeholder="Enter name here..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                />
        <label>Email</label>
        <input
            type="text"
            placeholder="Enter email address here... "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
        />
        <label>Password</label>
        <input
            type="password"
            placeholder="Enter password here..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
        />
        <label>I am a...</label>
        <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2] text-[#d6d6d6]"
        >
            <option value="" disabled>
                Select your role
            </option>
            <option value="donor">Donor</option>
            <option value="beneficiary">Beneficiary</option>

        </select>
      <button 
        type="submit"
        className="mt-10 border border-[#2eb4a2] px-16 py-3 text-[#2eb4a2] text-lg hover:bg-[#2eb4a2] hover:text-black transition rounded-md"
        >
        Confirm
      </button>
    </form>

    {/* Flowbite Toast */}
    {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      <div className="mt-6 text-center text-[#c6b88a] text-[15px]">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="hover:underline">
            Click here to sign in!
          </Link>
        </p>
      </div>
    </div>
  );
}

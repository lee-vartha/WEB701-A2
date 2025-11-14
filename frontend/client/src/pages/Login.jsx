import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Toast from "../components/Toast";


export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [toastMsg, setToastMsg] = useState("")
    const { setIsLoggedIn, setUsername, setRole} = useContext(AuthContext);
    const navigate = useNavigate();
    
    const API = "http://localhost:5000/api/auth";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.name);
                localStorage.setItem("role", data.user.role);

                setIsLoggedIn(true);
                setUsername(data.user.name);
                setRole(data.user.role);

                setToastMsg("Welcome back! +1 Token for Activity");
                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 1500);
                
            } else {
                setToastMsg(data.message || "Invalid credentials");
            }
        } catch (err) {
            setToastMsg("Server error. Please try again");
        }
    };


    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-dark text-accent">
            <h1 className="text-4xl mb-10 font-serif">Login</h1>
            <form
                onSubmit={handleSubmit}
                className="border border-gray-600 p-10 rounded-md w-[400px] flex flex-col gap-5"
            >
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[300px] p-2 bg-transparent border border-gray-600 rounded-md text-center"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[300px] p-2 bg-transparent border border-gray-600 rounded-md text-center"

                />
                <button 
                    type="submit"
                    className="mt-6 border border-tealish text-tealish py-2 hover:bg-tealish hover:text-black transition"
                >
                    Confirm
                </button>
            </form>

            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
            <p className="mt-6 text-sm">
                Don't have an account?{" "}
                <a href="/register" className="underline hover:text-tealish">
                    Click here to register!
                </a>
            </p>
        </div>
    );
}
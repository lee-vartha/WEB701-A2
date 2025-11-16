import React, {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import Toast from "../components/Toast";
import { useChatbotError } from "../components/ChatbotProvider";

export default function Settings() {
    const {user} = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
    });
    const [toastMsg, setToastMsg] = useState("");
    const {sendErrorToChat} = useChatbotError();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/users/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                setToastMsg("Profile updated successfully!");
                setFormData({ ...formData, password: ""});
            } else {
                setToastMsg(data.msg || "Failed to update profile");
                sendErrorToChat("A failure to update the profile");

            }
        } catch {
            setToastMsg("Server error. Try again later");
            sendErrorToChat("Server error occured");

        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#1f1f1f] text-[#d6d6d6] font-serif px-6">
            <div className="border border-gray-700 bg-[#242424] rounded-lg p-10 w-full max-w-md shadow-md">
                <h1 className="text-3xl text-[#c6b88a] mb-6 text-center">Account Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-left mb-1 text-gray-400">Name</label>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="block text-left mb-1 text-gray=400">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                            type="email"
                        />
                    </div>
                    <div>
                        <label className="block text-left mb-1 text-gray=400">New Password</label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                            type="password"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full border border-[#2eb4a2] text-[#2eb4a2] px-6 py-3 rounded-md hover:bg-[#2eb4a2] hover:text-black transition">
                            Save Changes
                        </button>
                </form>
            </div>
            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")}/>}
        </div>
    )
}
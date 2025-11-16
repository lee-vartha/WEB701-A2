import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import { useChatbotError } from "../components/ChatbotProvider";

export default function Profile() {
    const {tokenBalance, setTokenBalance} = useContext(AuthContext);
    const navigate = useNavigate();
    const [tokenStreak, setTokenStreak] = useState(0);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {sendErrorToChat} = useChatbotError();

    const API_RESERVATIONS = "http://localhost:5000/api/reservations";
    const API_USER = "http://localhost:5000/api/auth/me";

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(API_USER, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const data = await res.json();

                if (res.ok) {
                    setTokenBalance(data.tokens || 0);
                    setTokenStreak(data.tokenStreak || 0);
                } else {
                    console.error("Failed to fetch user info:", data.message);
                }
            } catch (err) {
                console.error("Error loading user info:", err);
            }
        };
        fetchUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const res = await fetch(API_RESERVATIONS, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                const data = await res.json();

                if (res.ok && Array.isArray(data)) {
                    setReservations(data);
                } else {
                    setError(data.message || "Failed to load reservations");
                    setReservations([]);
                }
            } catch (err) {
                console.error("Error fetching reservations:", err);
                setError("Server error. Please try again later.");
                sendErrorToChat("An issue happened with the server");
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSignout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#1f1f1f] text-[#d6d6d6] font-serif px-20 py-16">
            <h1 className="text-4xl text-[#c6b88a] mb-10">My Profile</h1>
            
            <div className="flex flex-col md:flex-row gap-8 mb-10">
                <div className="flex-1 border border-gray-700 rounded-md p-6 flex flex-col justify-center items-center">
                    <p className="text-[#2eb4a2] text-3xl font-light mb-1">
                        Token Balance: {tokenBalance}
                    </p>
                    <p className="text-sm text-gray-400">Resets in 2 days at 00:00AM</p>
                </div>

                <div className="flex-1 border border-gray-700 rounded-md p-6 flex flex-col justify-center items-center">
                    <p className="text-[#2eb4a2] text-3xl font-light mb-1">
                        Token Streak: {tokenStreak} Days
                    </p>
                    <p className="text-sm text-gray-400">Keep Going!</p>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-xl text-[#c6b88a] mb-4">Reservation History:</h2>
                {loading ? (
                <p className="text-gray-400 italic">Loading reservations...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : reservations.length === 0 ? (
                    <p className="text-gray-400 italic">
                        You have no reservations yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {reservations.map((reserve) => (
                            <div
                                key={reserve._id}
                                className="flex items-center justify-between border-b border-gray-700 pb-2"
                            >
                                <div>
                                    <p className="text-[#2eb4a2]">{reserve.product?.name}</p>
                                    <p className="text-sm text-gray-400">
                                        {reserve.product?.vendor || "Unknown Vendor"}
                                    </p>
                                </div>
                                <span className="text-sm text-gray-400 italic">
                                    {new Date(reserve.createdAt).toLocaleDateString("en-NZ", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-700 pt-8 flex flex-col items-center gap-4">
                <button 
                    onClick={handleSignout}
                    className="border border-[#2eb4a2] px-6 py-2 rounded-md hover:bg-[#2eb4a2] hover:text-black transition">
                        Sign Out
                </button>
                <p className="text-gray-400 text-sm italic">
                    Tip: Earn tokens by volunteering with us!
                </p>
            </div>
        </div>
    );
}
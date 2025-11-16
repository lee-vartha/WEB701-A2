import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import Toast from "../components/Toast";
import QrReader from "react-qr-reader-es6";
import {motion, AnimatePresence} from "framer-motion";
import { useChatbotError } from "../components/ChatbotProvider";


export default function Donate() {
    const {isLoggedIn, role, userId} = useContext(AuthContext);
    const [toastMsg, setToastMsg] = useState("")
    const [showScanner, setShowScanner] = useState(false);
    const [scanTargetId, setScanTargetId] = useState(null);
    const [reservation, setReservation] = useState([]);
    const [activeListings, setActiveListings] = useState([]);
    const [mealsDonated, setMealsDonated] = useState(0);
    const [setShowSuccess] = useState(false);

    const {sendErrorToChat} = useChatbotError();

    const [formData, setFormData] = useState({
        name: "",
        vendor: "",
        tokens: "",
        description: "",
        expiry: "",
        image: "",
    });

    const API = "http://localhost:5000/api/products";
    const API_RESERVATIONS = "http://localhost:5000/api/reservations";

    useEffect(() => {
        async function fetchMyListings() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}?donorId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (Array.isArray(data)) {
                    setActiveListings(data);
                    setMealsDonated(data.length);
                }
            } catch (err) {
                console.error("Error fetching listings:", err);

            }
        }
        fetchMyListings();
    }, [userId]);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_RESERVATIONS}/donor/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (Array.isArray(data)) {
                setReservation(data);
            }
        } catch (err) {
            console.error("Error fetching reservations:", err);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [userId]);


    const sendToBackend = async (payload) => {
    const res = await fetch("http://localhost:5000/api/tokens/accept", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ticketId: payload.ticketId}),
    });

    const result = await res.json();

    if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500)
    }

    setToastMsg(result.msg);
    };

   const handleScan = (data, expectedTicketId) => {
        if (!data) return; 
        let parsed;
        try {
            parsed = JSON.parse(data);
        } catch {
            setToastMsg("Invalid QR");
            return;
        }

        if (parsed.ticketId !== expectedTicketId) {
            setToastMsg("This QR code doesn't match the reservation");
            return
        }
            sendToBackend(JSON.parse(data));
            fetchReservations();
            setShowScanner(false);
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!formData.name || !formData.vendor || !formData.tokens || !formData.description || !formData.expiry || !formData.image) {
            setToastMsg("Please fill in all required fields.");
            sendErrorToChat("User didnt fill all fields out");
            return;
        }
        
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`,},
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                setToastMsg("Donation submitted successfully!");
                setMealsDonated(prev => prev + 1);
                setActiveListings(prev => [...prev, data]);
                
                setFormData({
                    name: "",
                    vendor: "",
                    tokens: "",
                    description: "",
                    expiry: "",
                    image: "",
                });
            } else {
                setToastMsg(data.message || "Donation submission failed. Try again.");
            }
        } catch (err) {
            setToastMsg("Server error. Please try again later.");
            sendErrorToChat("Server error had occured");
        }
    };

        return (
            <div className="min-h-screen flex flex-col justify-start items-center bg-[#1f1f1f] text-[#d6d6d6] font-serif text-center px-10 pt-32">
                {(!isLoggedIn || (role !== "donor" && role !== "admin")) ? (
                <div className="flex flex-col justify-center items-center text-center">
                    <div className="border border-gray-700 bg-[#242424] py-10 rounded-lg shadow-md max-w-lg">
                        <h1 className="text-3xl text-[#c6b88a] mb-4">Become a Donor</h1>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Donating is suited for <span className="text-[#2eb4a2] font-semibold">cafes, restaurants and food vendors</span> who wish to support
                            the community by offering surplus meals. By donating, you help reduce food waste and provide late night meals to those in need.
                        </p>
                        <p className="text-gray=400 mb-8">
                            To donate, please <span className="text-[#2eb4a2] font-semibold">sign in or register as a Donor account</span>
                        </p>
                        <a href="/register" className="border border-[#2eb4a2] px-6 py-3 text-[#2eb4a2] rounded-md hover:bg-[#2eb4a2] hover:text-black transition">
                        Register as Donor</a>
                    </div>
                </div>
            ) : (
            
            <div className="min-h-screen bg-[#1f1f1f] text-[#d6d6d6] font-serif px-10 py-20">
            <h1 className="text-4xl text-[#c6b88a] mb-12">Donor Dashboard</h1>

            <div className="grid grid-cols-1 grid-rows-1 gap-6 mb-10">
                {/* <div className="border border-gray-700 bg-[#242424] rounded-lg p-6 flex flex-col items-center">
                    <span className="text-2xl mb-2">[]</span>
                    <p className="text-[#c6b88a] text-lg">Token Balance: {tokenBalance}</p>
                </div> */}

                <div className="border border-gray-700 bg-[#242424] rounded-lg p-6 flex flex-col items-center">
                    <span className="text-2xl mb-2">Meals Donated</span>
                    <p className="text-[#c6b88a] text-xl">{mealsDonated}</p>
                </div>

                <div className="lg:col-span-2 border border-gray-700 bg-[#242424] rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#2eb4a2]">
                        Active Reservations
                    </h2>

                    {reservation.length === 0 ? (
                        <p className="text-gray-500">No reservations.</p>
                    ) : (
                        <div className="space-y-4">
                            {reservation.map((reservation) => (
                                <div key={reservation._id} className="border border-gray-700 brounded p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-[#2eb4a2] font-semibold">{reservation.productId.name}</p>
                                        <p className="text-sm text-gray-300">
                                            Reserved by: {reservation.userId?.name || "Unknown user"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Expires: {new Date(reservation.expiresOn).toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setShowScanner(true);
                                            setScanTargetId(reservation.ticketId);
                                        }}
                                        className="bg-[#2eb4a2] text-black px-3 py-2 rounded-md hover:scale-105 transition">
                                            Scan QR
                                        </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                    <AnimatePresence>
                        {showScanner && (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                                onClick={() => setShowScanner(false)}
                                >
                                    <motion.div
                                        initial={{scale: 0.8}}
                                        animate={{scale: 1}}
                                        exit={{scale: 0.8}}
                                        className="bg-[#242424] p-6 rounded-lg border border-gray-700"
                                        onClick={(e) => e.stopPropagation()}
                                        >
                                            <h2 className="text-lg font-semibold text-[#2eb4a2] mb-4 text-center">
                                                Scan Reservation QR
                                            </h2>
                                            <QrReader
                                                delay={200}
                                                onError={handleError}
                                                onScan={(data) => handleScan(data, scanTargetId)}
                                                style={{width: "260px"}}
                                            ></QrReader>

                                            <button
                                                onClick={() => setShowScanner(false)}
                                                className="mt-4 bg-[#2eb4a2] text-black py-2 px-4 rounded-md w-full">
                                                    Close
                                                </button>
                                        </motion.div>
                                </motion.div>
                        )}
                    </AnimatePresence>
            
            </div>

            <hr className="border-gray-700 mb-10"></hr>

            <h2 className="text-2xl text-[#C6B88A] mb-4">Create Listing</h2>
            <form
                onSubmit={handleSubmit}
                className="border border-gray-700 rounded-lg p-6 bg-[#242424] mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    type="text"
                    placeholder="Meal Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                    className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                />
                <input
                    type="text"
                    placeholder="Vendor Name"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value})}
                    className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                />
                <input
                    type="number"
                    placeholder="Token Amount"
                    value={formData.tokens}
                    onChange={(e) => setFormData({ ...formData, tokens: e.target.value })}
                    className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value})}
                    className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                />
                <input
                    type="date"
                    placeholder="Expiry Time"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value})}
                    className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value})}
                    className="p-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-[#2eb4a2]"
                />

                <div className="md:col-span-2 flex justify-center">
                    <button
                        type="submit"
                        className="border border-[#2eb4a2] text-[#2eb4a2] px-6 py-3 rounded-md hover:bg-[#2eb4a2] hover:text-black transition"
                    >
                        Submit Donation
                    </button>
                </div>
            </form>

            <hr className="border-gray-700 mb-10"></hr>

            <h2 className="text-2xl text-[#c6b88a] mb-6">Active Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                {activeListings.map((meal) => (
                    <div
                        key={meal.id}
                        className="bg-[#242424] border border-gray-700 rounded-2xl shadow-md overflow-hidden w-[300px] transition hover:scale-105"
                    >
                        <img src={meal.image} alt={meal.name} className="h-40 w-full object-cover"></img>
                        <div className="p-4 flex flex-col justify-between h-[150px]">
                            <div>
                                <h3 className="text-lg text-[#2eb4a2]">{meal.name}</h3>
                                <p className="text-sm text-gray-400">{meal.vendor}</p>
                                <p className="text-xs text-gray-500 mb-2">{meal.time}</p>
                                <p className="text-sm text-gray-300">{meal.tokens} Token{meal.tokens > 1 ? "s" : ""}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
            )}
            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        </div>
    );
};

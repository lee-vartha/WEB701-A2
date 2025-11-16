import React, {useContext, useEffect, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import Toast from "../components/Toast"
import {QRCodeCanvas} from "qrcode.react";
import {motion, AnimatePresence} from "framer-motion";
import { useChatbotError } from "../components/ChatbotProvider";


export default function BrowseMeals() {
    const {isLoggedIn, role, setTokenBalance} = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [toastMsg, setToastMsg] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");

    const [activeReservation, setActiveReservation] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    const {sendErrorToChat} = useChatbotError();

    const API = "http://localhost:5000/api/products";
    const API_RESERVATIONS = "http://localhost:5000/api/reservations";

    useEffect(() => {
        const saved = localStorage.getItem("activeReservation");

        if (saved) {
            const parsed = JSON.parse(saved);

            if (new Date(parsed.expiresOn) > new Date()) {
                setActiveReservation(parsed);
            } else {
                localStorage.removeItem("activeReservation");
            }
        }
    }, []);

    useEffect(() => {
        const fetchMeals = async () => {
            try{
            const res = await fetch (API);
            const data = await res.json();

            console.log("Fetched data: ", data);

            if (Array.isArray(data)) {
                setMeals(data);
            } else {
                console.error("Expected array but got: ", data);
                setMeals([]);
            }
            } catch (err) {
                console.error("Error fetching meals: ", err);
                sendErrorToChat("Error fetching meals");
                setMeals([]);

            }
        };
        fetchMeals();
    }, []);

    useEffect(() => {
        if (!activeReservation) return;

        const interval = setInterval(() => {
            const now = new Date();
            const expiry = new Date(activeReservation.expiresOn);
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeLeft("Expired")
                localStorage.removeItem("activeReservation");
                setActiveReservation(null);
                setShowQRModal(false);
                setToastMsg("Your reservation has expired");

                clearInterval(interval);
                return;
            }

            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${minutes}m ${seconds}s`);

        }, 1000);

        return () => clearInterval(interval);
    }, [activeReservation]);


    const handleReserve = async (mealId, mealName) => {
        if (activeReservation) {
            setToastMsg("You already have an active reservation!");
            return;
        }
        
        if (!isLoggedIn) {
            setToastMsg("Please login as a beneficiary to reserve a meal");
            sendErrorToChat("User attempted reservation while not logged in");
            return;
        }

        if (role === "donor") {
            setToastMsg("Donors cannot reserve meals.");
            sendErrorToChat("Donor attempted to reserve a meal");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(API_RESERVATIONS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({productId: mealId}),
            });

            const data = await res.json();
            if (res.ok) {
                    if (data.updatedTokens !== undefined) {
                    setTokenBalance(data.updatedTokens);
                    }

                setMeals((prev) => 
                    prev.map((meal) =>
                    meal._id === mealId || meal.id === mealId
                        ? {...meal, status: "reserved", reservedBy: "me"}
                    : meal));
                setToastMsg(`You have reserved "${mealName}".`);

                const reservation = {
                    ticketId: data.ticketId,
                    userId: data.userId,
                    expiresOn: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                };
                setActiveReservation(reservation);
                localStorage.setItem(
                    "activeReservation",
                    JSON.stringify(reservation)
                );
            } else {
                setToastMsg(data.message || "Could not reserve meal");
                sendErrorToChat("Beneficiary tried reserving a meal but couldn't");

            }
        } catch {
            setToastMsg("Server error. Please try again later.");
            sendErrorToChat("Server error occured");

        }
    };

    const filteredMeals = Array.isArray(meals) 
        ? meals.filter((meal) => 
            meal.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className="min-h-screen bg-[#1f1f1f] text-[#d6d6d6] font-serif px-24 py-20">
            <h1 className="text-4xl text-[#c6b88a] mb-8">Browse Meals</h1>

            {/* filter and search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <input
                    type="text"
                    placeholder="Search meals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-[300px] p-2 bg-transparent border border-[#2eb4a2] rounded-md focus:outline-none focus:border-[#c6b88a]"
                />
            </div>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setFilter("All")}
                    className={`border px-4 py-1 rounded-md ${
                        filter === "All"
                         ? "border-[#2eb4a2] text-[#2eb4a2]"
                         : "border-gray-700 text-gray-400 hover:border-[#2eb4a2] hover:text-[#2eb4a2]"
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("Nearby")}
                    className={`border px-4 py-1 rounded-md ${
                        filter === "Nearby"
                         ? "border-[#2eb4a2] text-[#2eb4a2]"
                         : "border-gray-700 text-gray-400 hover:border-[#2eb4a2] hover:text-[#2eb4a2]"
                    }`}
                >
                    &lt;10km
                </button>
                <button
                    onClick={() => setFilter("Popular")}
                    className={`border px-4 py-1 rounded-md ${
                        filter === "Popular"
                         ? "border-[#2eb4a2] text-[#2eb4a2]"
                         : "border-gray-700 text-gray-400 hover:border-[#2eb4a2] hover:text-[#2eb4a2]"
                    }`}
                >
                    Popular
                </button>
                <button
                    onClick={() => setFilter("Any")}
                    className={`border px-4 py-1 rounded-md ${
                        filter === "Any"
                         ? "border-[#2eb4a2] text-[#2eb4a2]"
                         : "border-gray-700 text-gray-400 hover:border-[#2eb4a2] hover:text-[#2eb4a2]"
                    }`}
                >
                    Any Cuisine
                </button>
            </div>

            {/* meals */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-14 justify-center py-5">
                {filteredMeals.map((meal) => (
                    <div
                        key={meal.id}
                        className="bg-[#242424] border border-gray-700 rounded-2xl shadow-md overflow-hidden w-[380px] transition"
                    >
                        <img
                            src={meal.image}
                            alt={meal.name}
                            className="h-40 w-full object-cover"
                        >
                        </img>
                        <div className="p-4 flex flex-col justify-between h-[150px] mb-5">
                            <div>
                                <h3 className="text-lg text-[#2eb4a2]">{meal.name}</h3>
                                <p className="text-sm text-gray-400">{meal.vendor}</p>
                                <p className="text-xs text-gray-400 mb-2">{meal.time}</p>
                                <p className="text-[#c6b88a] text-sm font-semibold">
                                    {meal.tokens} Token{meal.tokens >1 ? "s" : ""}
                                </p>
                            </div>
                            <button
                                onClick={() => handleReserve(meal._id, meal.name)}
                                disabled={meal.status === "reserved"}
                                className={`mt-3 border text-sm px-3 py-1 rounded-md transition 
                                    ${meal.status === "reserved"
                                        ? "border-gray-700 text-gray=500 cursor-not-allowed"
                                        : "border-[#2eb4a2] text-[#2eb4a2] hover:bg-[#2eb4a2] hover:text-black"}`}
                            >
                                {meal.status === "reserved" ? "Reserved" : "Reserve"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {activeReservation && timeLeft !== "Expired" &&  (
                <div className="fixed bottom-6 left-6 z-[2000]">
                    <button
                        onClick={() => setShowQRModal(true)}
                        className="bg-[#2eb4a2] text-black px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition font-semibold"
                    >
                        QR C0DE
                        <span className="ml-2 text-sm text-gray-800">
                            {timeLeft}
                        </span>
                    </button>
                </div>
            )}

            <AnimatePresence>
                {showQRModal && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                        onDirectionLock={() => setShowQRModal(false)}
                    >
                        <motion.div
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            transition={{duration: 0.25}}
                            className="bg-[#242424] p-8 rounded-xl shadow-2xl text-center border border-gray-700 w-[320px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg text-[#2eb4a2] font-semibold mb-4">
                                Show this QR code to the donor
                            </h2>

                        <div className="mx-auto bg-white p-3 rounded-lg shadow-inner w-fit">
                            <QRCodeCanvas
                                value={JSON.stringify({ticketId: activeReservation.ticketId, userId: activeReservation.userId})}
                                size={220}
                                bgColor="#ffffff"
                                fgColor="#000000"
                            ></QRCodeCanvas>
                        </div>

                            <p className="mt-5 text-sm text-gray-300">
                                Expires in: <span className="font-semibold">{timeLeft}</span>
                            </p>

                            <button
                                onClick={() => setShowQRModal(false)}
                                className="mt-6 bg-[#2eb4a2] text-black px-4 py-2 rounded-lg hover:scale-105 transition"
                            >
                                    Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        </div>
    );
}
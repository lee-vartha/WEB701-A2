import React, {useContext, useEffect, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import Toast from "../components/Toast"


export default function BrowseMeals() {
    const {isLoggedIn, role, setTokenBalance} = useContext(AuthContext);
    const [meals, setMeals] = useState([]);
    const [toastMsg, setToastMsg] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");

    const API = "http://localhost:5000/api/products";
    const API_RESERVATIONS = "http://localhost:5000/api/reservations";

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
                setMeals([]);
            }
        };
        fetchMeals();
    }, []);

    const handleReserve = async (mealId, mealName) => {
        if (!isLoggedIn) {
            setToastMsg("Please login as a beneficiary to reserve a meal");
            return;
        }

        if (role === "donor") {
            setToastMsg("Donors cannot reserve meals.");
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

            } else {
                setToastMsg(data.message || "Could not reserve meal");
            }
        } catch {
            setToastMsg("Server error. Please try again later.");
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

            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        </div>
    );
}
import {useNavigate, Link} from "react-router-dom";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import React, {useState, useEffect, useContext, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";

import "flowbite";

export default function Navbar() {
    const [accountOpen, setAccountOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isLoggedIn, setIsLoggedIn, username, setUsername, role, setRole} = useContext(AuthContext);
    const {tokenBalance} = useContext(AuthContext);
    const navigate = useNavigate();

    const accountRef = useRef(null);
    const mobileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setAccountOpen(false);
            }

            if (mobileRef.current && !mobileRef.current.contains(event.target)) {
                setMobileOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    
    }, []);

    useEffect(() => {
          import ("flowbite");
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [setIsLoggedIn]);
    
    const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setUsername("");
    setRole("");

    navigate("/")
}

    return (


        <nav className="bg-black border-b border-gray-700 text-tealish font-serif">
            <div className="w-full flex justify-between items-center pl-10 pr-18 px-12 py-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img src={logo} alt="Late Night Nosh Logo" className="w-[120px] h-[65px] hover:scale-105 transition-transform duration-200 pl-11"></img>
                </Link>

                {/* Nav Links */}
                <ul className="hidden md:flex items-center gap-16 text-[18px]">
                    <li>
                        <Link to="/" className="relative list-none text-[18px] text-[#c6e7e0] hover:text-[#d6d6d6] transition-colors duration-300
                        after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-0 after:bg-[#d6d6d6]
                        after:transition-all after:duration-300 hover:after:w-full">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/browsemeals" className="relative list-none text-[18px] text-[#c6e7e0] hover:text-[#d6d6d6] transition-colors duration-300
                        after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-0 after:bg-[#d6d6d6]
                        after:transition-all after:duration-300 hover:after:w-full">
                            Browse Meals
                        </Link>
                    </li>
                    <li>
                        <Link to="/donate" className="relative list-none text-[18px] text-[#c6e7e0] hover:text-[#d6d6d6] transition-colors duration-300
                        after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-0 after:bg-[#d6d6d6]
                        after:transition-all after:duration-300 hover:after:w-full">
                            Donate
                        </Link>
                    </li>
                    {isLoggedIn && role === "admin" && (
                        <a href="/admin" className="text-[#2eb4a2] hover:text-[#c6b88a] transition mx-4">
                        Admin</a>
                    )}
                </ul>
                
                {/* Account Dropdown */}
                <div className="relative" ref={accountRef}>
                <button
                    onClick={() => setAccountOpen((prev) =>  !prev)}
                    className="list-none flex relative item-center gap-2 text-[18px] text-[#c6e7e0] hover:text-[#d6d6d6]  transition-colors duration-300
                                            after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-0 after:bg-[#d6d6d6]
                                            after:transition-all after:duration-300 hover:after:w-full"                
                                            >
                    <span>Account</span>
                    <svg
                    className="w-4 h-4 translate-y-[5px]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                    >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                    </svg>
                </button>

                <AnimatePresence>
                {accountOpen && (
                    <motion.div 
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity:1, y:0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.25, ease: "easeOut"}}
                        className="absolute right-0 top-full mt-2 z-50"
                    >
                    {/* GUEST DROPDOWN */}
                    {!isLoggedIn ? (
                        <div className="list-none border border-gray-700 bg-[#1f1f1f] text-tealish rounded-md shadow-md w-72">
                            <div className="p-5 text-center border-b border-gray-700">
                                <h3 className="text-xl text-[#e6e6e6] font-serif mb-2">Welcome, Guest</h3>
                                <p className="text-sm text-gray=400">
                                    You must login to view token balance, reserve meals or donate.
                                </p>
                            </div>

                            <div className="p-4 flex justify-center">
                                <Link to="/login" 
                                onClick={() => setAccountOpen(false)} 
                                className="flex items-center gap-2 border border-[#2eb4a2] rounded-md px-4 py-2 hover:bg-[#2eb4a2] hover:text-black transition">

                                    {/* <svg
                                        className="w-5 h-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M12 11V7m0 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        >
                                        </path>
                                    </svg> */}
                                    Log In / Register
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* LOGGED IN */
                        <div className="absolute right-0 top-full mt-2 z-50 divide-y divide-gray-700 rounded-md shadow-md w-60 bg-[#1f1f1f] border border-gray-700 text-tealish">
                        {/* Header */}
                            <div className="px-4 py-3 text-sm border-b border-gray-700">
                            <p className="font-serif text-lg">Welcome, {username}</p>
                            
                            {role === "beneficiary"  && (
                            <p className="flex items-center gap-1 text-sm text-[#2eb4a2] mt-1">
                            <svg
                                className="w-4 h-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Token Balance: {tokenBalance}
                            </p>

                            )}
                        </div>

                        {/* Menu Items */}
                        <ul className="py-2 text-sm">
                            <li>
                            <Link to="/myprofile" className="flex items-center gap-2 px-4 py-2 hover:bg-[#2eb4a210] transition">
                                My Profile
                            </Link>
                            </li>
                            <li>
                            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-[#2eb4a210] transition">
                                Settings
                            </Link>
                            </li>
                        </ul>
    
                    <div className="border-t border-gray-700">
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm hover:bg-[#2eb4a210] transition"
                        >
                            Sign Out
                        </button>
                    </div>
                    </div>
                    )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

                {/* MOBILE */}
                <button
                    className="md:hidden text-[#2eb4a2] text-3xl focus:outline-none"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile Dropdown */}
        <AnimatePresence>
            {mobileOpen && (
                <motion.div ref={accountRef}
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity:0, y: -10}}
                    transition={{duration: 0.25, ease: "easeOut"}}
                    className="md:hidden absolute top-[90px] right-8 bg-black border border-gray-700 text-tealish font-serif z-[1000]"
                >
                        <ul className="flex flex-col items-end gap-4 text-[16px] px-12 pr-6 py-5">
                        <li>
                            <Link to="/" onClick={() => setMobileOpen(false)}
                            className="hover:text-[#2eb4a2]"
                            >
                            Home
                            </Link>
                        </li>

                        <li>
                           <Link to="/browse" onClick={() => setMobileOpen(false)}
                           className="hover:text-[#2eb4a2]"
                           >
                            Browse Meals
                           </Link> 
                        </li>

                        <li>
                           <Link to="/donate" onClick={() => setMobileOpen(false)}
                           className="hover:text-[#2eb4a2]"
                           >
                            Donate
                           </Link> 
                        </li>
                    </ul>
                </motion.div>
            )}
            </AnimatePresence>
        </nav>
    );
}
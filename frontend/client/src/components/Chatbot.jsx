import React, { useState, useEffect, useRef, createContext, useContext} from "react";
import {motion, AnimatePresence} from "framer-motion";
import { useChatbotError } from "./ChatbotProvider";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const {registerErrorSender} = useChatbotError();

    const [messages, setMessages] = useState([
        {sender: "bot", text: "Hey there! How can I help?"},
    ]);

    useEffect(() => {
        setMessages([{sender: "bot", text: "Hey there! How can I help?"}]);
        setUnreadCount(0);
    }, []);

    const [input, setInput] = useState("");
    const chatRef = useRef(null);
    const buttonRef = useRef(null);

    const sendErrorToChat = async (errorMessage) => {
        setMessages((prev) => [
            ...prev,
            {sender: "bot", text: "Did you see the toast popup? Let me check that error..."}
        ]);

        if (!isOpen) {
            setUnreadCount((prev) => prev + 1);
        }
        
        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    message: `SYSTEM_ERROR: ${errorMessage}`
                }),
            });

            const data = await res.json()

            setMessages((prev) => [
                ...prev,
                {sender: "bot", text: data.reply || "Actually, I'm not sure what caused that.", isError: true}
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {sender: "bot", text: "I couldn't analyse the error due to server issues", isError: true}
            ])
        }
    };

    useEffect(() => {
        registerErrorSender(sendErrorToChat);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = {sender: "user", text: input};
        setMessages((prev) => [...prev, userMessage]);

        const userInput = input;
        setInput("");

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: userInput}),
            });

            const data = await res.json();

            const botReply = {
                sender: "bot",
                text: data.reply || "I can't understand that",
                isError: false
            };

            setMessages((prev) => [...prev, botReply]);
        } catch (err) {
            setMessages((prev) => [...prev, {sender: "bot", text: "Error contacting AI server"}]);
            sendErrorToChat("The server could not be reached");
        };
    };
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                chatRef.current && 
                !chatRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    
    }, []);
    

    return (
        <>
        {/* floating button */}
            <div className="fixed bottom-6 right-6 z-50 pointer-events-auto" >
            <motion.button
                type="button"
                ref={buttonRef}
                onClick={() => {setIsOpen((prev) => !prev);
                                setUnreadCount(0);
                }}
                className="bg-[#2eb4a2] text-black font-semibold px-4 py-3 rounded-full shadow-lg hover:scale-110 transition"
                >
                    {isOpen ? "x" : "Chat"}
                </motion.button>

                {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                    </div>
                )}
            </div>

                {/* chat window */}
                <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div ref={chatRef}
                        key="chat-window"
                        initial={{opacity: 0, y:50}}
                        animate={{opacity: 1, y:0}}
                        exit={{opacity: 0, y:50}}
                        transition={{duration: 0.3}}
                        className="fixed bottom-20 right-6 w-80 h-96 bg-[#242424] border border-gray-700 rounded-lg shadow-xl flex flex-col overflow-hidden z-[10000]"
                        >
                            <div className="bg-[#2eb4a2] text-black text-center py-2 font-semibold">
                                Chat Support
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-md max-w-[75%] ${
                                            msg.sender === "user"
                                            ? "bg-[#2eb4a2] text-black ml-auto"
                                            : msg.isError
                                            ? "bg-red-900 text-red-200 border border-red-700 mr-auto"
                                            : "bg-[#333] text-white mr-auto"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                            </div>

                            <div className="flex p-2 border-t border-gray-700">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border border-gray-600 rounded-md px-2 py-1 text-[#d6d6d6] focus:outline-none"
                                ></input>
                                <button
                                    onClick={handleSend}
                                    className="ml-2 bg-[#2eb4a2] text-black px-3 rounded-md hover:scale-105 transition">
                                        Send
                                    </button>
                            </div>
                        </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}


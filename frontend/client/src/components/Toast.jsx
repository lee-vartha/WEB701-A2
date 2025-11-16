import React, {useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";


export default function Toast({message, onClose}) {

    useEffect(() => {
    if (message) {
        const timer = setTimeout(onClose, 2500);
        return () => clearTimeout(timer);
    }
    }, [message, onClose]);

    return (
        <AnimatePresence>
        {message && (
            <motion.div
            key="toast"
            initial={{opacity: 0, y: 40, scale: 0.95}}
            animate={{opacity: 1, y: 0, scale:1}}
            exit={{opacity: 0, y:40, scale: 0.95}}
            transition={{duration: 0.3, ease: "easeOut"}}
            className="fixed bottom-5 inset-x-0 mx-auto z-[9999] flex items-center w-full max-w-xs p-4 text-gray-500 bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-lg"
            role="alert"
        >
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-[#2eb4a2] bg-teal-100 rounded-lg dark:bg-teal-900 dark:text-teal-200">
                <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 20"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
                    >
                    </path>
                </svg>
            </div>
            <div className="ms-3 text-sm font-normal">{message}</div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}
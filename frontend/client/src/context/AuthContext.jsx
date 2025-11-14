import React, {createContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [tokenBalance, setTokenBalance] = useState(5);
    const [userId, setUserId] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) setUsername(storedUsername);
            if (storedRole) setRole(storedRole);

            if (storedRole === "donor") {
                setTokenBalance(null);
            }

            fetchUserProfile(token);
        }
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/me", {
                headers: {Authorization: `Bearer ${token}`},
            });
            const data = await res.json();
            if (res.ok) {
                setUsername(data.name);
                setRole(data.role);
                setTokenBalance(data.tokens ?? 5);
                localStorage.setItem("username", data.name);
                localStorage.setItem("role", data.role);
            } else {
                console.error("Failed to load user profile:", data.msg);
            }
        } catch (err) {
            console.error("Error loading user:", err);
        }
    };

    return (
        <AuthContext.Provider 
        value={{isLoggedIn, setIsLoggedIn, username, setUsername, role, setRole, tokenBalance, setTokenBalance}}
        >
            {children}
        </AuthContext.Provider>
    );
};
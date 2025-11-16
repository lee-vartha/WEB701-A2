import React, {createContext, useContext, useRef} from "react";

export const ChatbotErrorContext = createContext(null);

export const useChatbotError = () => useContext(ChatbotErrorContext);

export default function ChatbotProvider({children}) {
    const sendErrorRef = useRef(null);

    const registerErrorSender = (fn) => {
        sendErrorRef.current = fn;
    };

    const sendErrorToChat = (msg) => {
        if (sendErrorRef.current) {
            sendErrorRef.current(msg);
        }
    };

    return (
        <ChatbotErrorContext.Provider
            value={{sendErrorToChat, registerErrorSender}}
        >
            {children}
        </ChatbotErrorContext.Provider>
    )
}
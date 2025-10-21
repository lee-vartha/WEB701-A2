// importing necessary modules and components
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MemberDashboard from "./pages/MemberDashboard";
import BeneficiaryDashboard from "./pages/BeneficiaryDashboard";


// getting the function to render the app
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("register"); // default tab

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        setUser={setUser}
      />

      <div className="p-6">
        {activeTab === "register" && (
          <Register setUser={setUser} setActiveTab={setActiveTab} />
        )}
        {activeTab === "login" && (
          <Login setUser={setUser} setActiveTab={setActiveTab} />
        )}
        {activeTab === "member" && user?.role === "member" && (
          <MemberDashboard user={user} setUser={setUser} />
        )}
        {activeTab === "beneficiary" && user?.role === "beneficiary" && (
          <BeneficiaryDashboard user={user} setUser={setUser} />
        )}
      </div>
    </div>
  );
}

export default App;

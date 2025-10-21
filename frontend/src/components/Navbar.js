import React from "react";

// function to render a nav bar
function Navbar({ activeTab, setActiveTab, user, setUser }) {
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setActiveTab("login");
  };

  // listing out the different tabs
  const tabs = [
    { key: "register", label: "Register" },
    { key: "login", label: "Login" },
    { key: "member", label: "Member Dashboard" },
    { key: "beneficiary", label: "Beneficiary Dashboard" },
  ];

  return (
    <nav className="flex space-x-6 border-b border-gray-700 px-6 py-3 bg-gray-800">
      <h1 className="text-lg font-bold flex-1">Charity App – MERN + JWT</h1>

      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 rounded ${
              activeTab === tab.key ? "border-b-2 border-orange-400 text-orange-400" : "text-gray-300 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {user && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

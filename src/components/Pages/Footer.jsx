import React, { useState } from "react";
import { FaHome, FaMoneyBillAlt, FaUserCircle, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosPeople } from "react-icons/io";
const Footer = () => {
  const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');

    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };
  
  return (
    <footer className="fixed bg-white bottom-0 left-0 right-0 py-4 px-6 flex justify-around">
      <button
        className={`flex flex-col items-center ${
          activeTab === "home" ? "text-blue-700" : "text-gray-500"
        }`}
        onClick={() => (handleTabChange("home"), navigate(""))}
      >

        <FaHome size={25} />
        <span className="text-sm font-bold mt-1">Home</span>
      </button>
      <button
        className={`flex flex-col items-center ${
          activeTab === "community" ? "text-blue-700" : "text-gray-500"
        }`}
        onClick={() => (handleTabChange("community"), navigate("communities"))}
      >
        <IoIosPeople size={25} />
        <span className="text-sm font-bold mt-1">Group</span>
      </button>
      <button
        className={`flex flex-col items-center ${
          activeTab === "personal" ? "text-blue-700" : "text-gray-500"
        }`}
        onClick={() => (handleTabChange("personal"), navigate("personal"))}
      >
        <FaMoneyBillAlt size={25} />
        <span className="text-sm font-bold mt-1">My Safes</span>
      </button>
      <button 
              onClick={() => (handleTabChange("profile"), navigate("profile"))}

      className={`flex flex-col items-center ${
          activeTab === "profile" ? "text-blue-700" : "text-gray-500"
        }`}>
        <FaUserCircle size={25}/>
        <span className="text-sm font-bold mt-1">Profile</span>
      </button>
    </footer>
  );
};

export default Footer;

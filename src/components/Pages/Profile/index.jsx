import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

const UserProfile = () => {
  const [profilePicture, setProfilePicture] = useState('https://cdn.discordapp.com/attachments/1171360992400248863/1252652611773923439/hfhdhhdhffh.png?ex=667ae827&is=667996a7&hm=1a2a8e7611e89d46b3a374baede73f050657dc1c2ac086ee58e650b2e87ae36f&');

  const { data: userAddress } = useQuery({
    queryKey: ["userAddress"],
  });

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const handleSaveChanges = () => {
    // Implement logic to save changes to the user's profile
    console.log('Saving changes...');
  };

  return (
    <div className="bg-[#FFFFFF] pb-12 min-h-screen">
      <header className="text-[#333333] py-4 px-6">
        <h1 className="text-2xl font-bold ">User Profile</h1>
      </header>

      <main className="p-6">
        <div className="bg-[#173F8A] text-white  rounded-lg p-4 mb-4">
          {/* <div className="flex items-center mb-4">
            <img src={profilePicture} alt="Profile" className="w-20 h-20 rounded-full mr-4" />
            <label htmlFor="profile-picture" className="cursor-pointer">
              <FaEdit className="text-[#FFC466]" />
              <input
                type="file"
                id="profile-picture"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </label>
          </div> */}
          <p className=" mb-2 text-sm">Wallet Address</p>
          <p className="font-semibold text-[13px] sm:text-sm mb-4">{userAddress && userAddress}</p>
          <p className=" mb-2">Total Saved</p>
          <p className="font-bold text-2xl">$10.67</p>
        </div>

        <div className="bg-[#173F8A] text-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Transaction History</h2>
          {/* Add transaction history table */}
        </div>
{/* 
        <div className="bg-[#FFFFFF] rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">Update Profile</h2>
          <button
            className="bg-[#000000] text-white font-bold py-3 px-6 rounded-full flex items-center justify-center w-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div> */}
      </main>
    </div>
  );
};

export default UserProfile;
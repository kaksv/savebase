import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import TimeRemaining from "../../Utils/TimeRemaining";
import { FiClock } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import useAuthentication from "../../../Hooks/useAuthentication";

const MySafes = () => {
  const { data: userSafes } = useQuery({
    queryKey: ["userSafes"],
  });

  const { addFundsToSafe, invalidatePesonalSafes, invalidateUserBalance } =
    useAuthentication();
  const [addModal, setAddModal] = useState(false);
  const [addAmount, setAddAmount] = useState(0);
  const [selectedSafeIndex, setSelectedSafeIndex] = useState(null);

  const { mutateAsync: HandleAddFunds } = useMutation({
    mutationFn: () => addFundsToSafe({ safeId: selectedSafeIndex, amount: addAmount }),
    onSuccess: async () => {
      await invalidatePesonalSafes();
      await invalidateUserBalance();
      setAddModal(false);
      setSelectedSafeIndex(null);
      setAddAmount(0);
    },
  });

  const handleAddButtonClick = (index) => {
    console.log("index :",index)
    setSelectedSafeIndex(index);
    setAddModal(true);
  };

  return (
    <div className="bg-[#FFFFFF] pb-12 min-h-screen">
      <header className=" py-4 text-[#333333] px-6">
        <h1 className="text-2xl font-bold">My Safes</h1>
      </header>

      <main className="p-6 text-white">
        {userSafes?.map((campaign, index) => (
          <div key={index} className="bg-[#173F8A] rounded-lg p-4  mb-4">
            <h2 className="text-lg font-bold">{campaign.safeName}</h2>
            <span>{Number(campaign?.safeAmount) / 1e18} cUSD</span>
            <div className="bg-orange-500 rounded-full h-8">
              {campaign && campaign.safeDuration && (
                <TimeRemaining timeH={Number(campaign.safeDuration) * 1e6} />
              )}
            </div>
            <button
              onClick={() => handleAddButtonClick(index)}
              className="mt-2 rounded-full p-2 bg-[#F5E5E6]"
            >

              <MdAdd size={24} color="orange"/>
            </button>
          </div>
        ))}
        {addModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#173F8A] rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg text-white font-bold mb-4">Top up Safe</h2>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                className="bg-white text-black rounded-full py-2 w-full px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50 mr-2"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
              <div className="flex mt-4 justify-end">
                <button
                  className="bg-[#FFC466] text-white font-bold py-2 px-4 rounded-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50 mr-2"
                  onClick={HandleAddFunds}
                >
                  Add
                </button>
                <button
                  className="bg-red-400 text-white font-bold py-2 px-4 rounded-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50"
                  onClick={() => {
                    setAddModal(false);
                    setSelectedSafeIndex(null);
                    setAddAmount(0);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MySafes;

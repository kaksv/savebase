import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const CommunityIndex = () => {
  const { data: communitySafes } = useQuery({
    queryKey: ["communitySafes"],
  });
  const { data: userAddress } = useQuery({
    queryKey: ["userAddress"],
  });
  const navigate = useNavigate();

  useEffect(() => {
    getSafeStats();
  }, [communitySafes]);

  const [participatedInSafes, setParticipatedInSafes] = useState([]);
  const [activeSafes, setActiveSafes] = useState([]);
  const [mySafes, setMySafes] = useState([]);
  const [succSafes,setSuccessSafes] = useState([]);

  const getSafeStats = () => {
    const allCommSafes = communitySafes?.length;
    const myCommSafes = communitySafes?.filter(
      (com) => com.communityAdmin === userAddress
    );
    const activSafes = communitySafes?.filter((com) => com.isActive === true);
    const particpatedSafes = communitySafes?.filter((com) =>
      com?.members?.includes(userAddress)
    );
    
    const succSafes = communitySafes?.filter((com) => Number(com.currentAmount) >Number(com.target));
    setSuccessSafes(succSafes)
    setParticipatedInSafes(particpatedSafes);
    setActiveSafes(activSafes);
    setMySafes(myCommSafes);
  };

  const [tab, setTab] = useState("all");
  return (
    <>
      {userAddress ? (
        <div className="bg-[#FFFFFF] pb-20 text-white min-h-screen">
          <header className="text-[#333333] py-4 px-6">
            <h1 className="text-2xl font-bold">Group Dashboard</h1>
          </header>
          <main className="p-6">
            <div className="bg-[#173F8A] rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 text-white gap-4">
                <div>
                  <p className="text-white">Successful Campaigns</p>
                  <p className="text-2xl  font-bold">
                    {succSafes?.length}
                  </p>
                </div>
                <div>
                  <p>Active Campaigns</p>
                  <p className="text-2xl font-bold">{activeSafes.length}</p>
                </div>
                <div>
                  <p className="">Participated Campaigns</p>
                  <p className="text-2xl font-bold">
                    {participatedInSafes.length}
                  </p>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#333333] mb-2">Active Campaigns</h2>
            <div className="flex  gap-6 w-full items-center text-[#333333] justify-center">
              <span
                className="bg-[#FFFFFF] cursor-pointer rounded-lg px-2"
                onClick={() => setTab("all")}
              >
                All
              </span>
              <span
                className="bg-[#FFFFFF] cursor-pointer rounded-lg px-2"
                onClick={() => setTab("mysafes")}
              >
                My campaigns
              </span>
            </div>

            <div className="bg-white rounded-lg mt-3">
              {tab === "all" && (
                <>
                  {communitySafes?.map((campaign,index) => (
                    <div
                      key={index}
                      className="bg-[#173F8A] text-white rounded-lg p-4 mb-4"
                    >
                      <h3 className="text-lg font-bold cursor-pointer mb-2" onClick={()=>navigate(`./${index}`)}>
                        {campaign.title}
                      </h3>
                      {/* <p className=" mb-2">
                        {campaign.description}
                      </p> */}
                      <div className="flex justify-between items-center mb-2">
                        <span>
                          Saved:{" "}
                          <span className="font-bold">
                            ${(Number(campaign.currentAmount)/1e18).toFixed(2)}
                          </span>
                        </span>
                        <span>
                          Goal:{" "}
                          <span className="font-bold">
                            ${(Number(campaign.target)/1e18).toFixed(2)}
                          </span>
                        </span>
                      </div>
                      <div className="bg-orange-500 rounded-full h-4">
                        <div
                          className="bg-green-600 rounded-full h-full"
                          style={{
                            width: `${((Number(campaign.currentAmount)) / (Number(campaign.target))) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {tab === "mysafes" && (
                <>
                  {mySafes?.map((campaign,index) => (
                   <div
                   key={index}
                   className="bg-[#173F8A] text-black rounded-lg p-4 mb-4"
                 >
                   <h3 className="text-lg font-bold mb-2 cursor-pointer" onClick={()=>navigate(`./${index}`)}>
                     {campaign.title}
                   </h3>
                   <p className=" mb-2">
                     {campaign.description}
                   </p>
                   <div className="flex justify-between items-center mb-2">
                     <span>
                       Saved:{" "}
                       <span className="font-bold">
                         ${(Number(campaign.currentAmount)/1e18).toFixed(2)}
                       </span>
                     </span>

                     <span>
                       Goal:{" "}
                       <span className="font-bold">
                         ${(Number(campaign.target)/1e18).toFixed(2)}
                       </span>
                     </span>
                   </div>
                   <div className="bg-orange-500 rounded-full h-4">
                     <div
                       className="bg-green-600 rounded-full h-full"
                       style={{
                         width: `${((Number(campaign.currentAmount)) / (Number(campaign.target))) * 100}%`,
                       }}
                     ></div>
                   </div>
                 </div>
                  ))}
                </>
              )}
            </div>
          </main>
        </div>
      ) : (
        navigate("/")
      )}
    </>
  );
};

export default CommunityIndex;

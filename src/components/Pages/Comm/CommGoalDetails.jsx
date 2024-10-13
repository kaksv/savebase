import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { CeloVestContractAddress } from "../../Utils/Constants";
import CeloVestAbi from "../../../contracts/celovest.abi.json";
import { celoAlfajores } from "viem/chains";
import useAuthentication from "../../../Hooks/useAuthentication";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
const rpc = "https://alfajores-forno.celo-testnet.org";

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(rpc),
});
const COmmGoalDetails = () => {
  const [campaign, setData] = useState(null);
  const [accessLoading, setAccessLoading] = useState(false);
  const { community_id } = useParams();
  const {
    invalidateCommunitySafes,
    invalidateUserBalance,
    approveUserRequest,
    denyUserRequest,
    createCommunityContribution,
  } = useAuthentication();

  const { data: communitySafes } = useQuery({
    queryKey: ["communitySafes"],
  });

  console.log("com id : ", community_id, communitySafes);
  const { data: userAddress } = useQuery({
    queryKey: ["userAddress"],
  });

  useEffect(() => {
    const filterData = communitySafes?.filter(
      (comm) => comm.id == community_id
    );
    setData(filterData);
  }, [community_id, communitySafes]);

  console.log("here is the data mazimas :", campaign);

  const { mutateAsync: ReqAccess } = useMutation({
    mutationFn: () => requestAcces(community_id),
    onSuccess: async () => {
      await invalidateCommunitySafes();
      await invalidateUserBalance();
      setAccessLoading(false);
    },
  });

  const requestAcces = async (id) => {
    if (typeof window !== "undefined" && window.ethereum) {
      let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
      });

      let [address] = await walletClient.getAddresses();

      let access = await walletClient.writeContract({
        address: CeloVestContractAddress,
        abi: CeloVestAbi,
        account: address,
        functionName: "requestToJoinCommunity",
        args: [id],
      });
      console.log("new safe results :", access);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: access,
      });

      console.log("new personal safe res :", receipt);
      return receipt;
    }
  };

  const RequestAccess = () => {
    return (
      <>
        {accessLoading ? (
          <ClipLoader color="lightblue" />
        ) : (
          <button
            onClick={ReqAccess}
            className="bg-[#FFC466] text-[#504C6B] font-bold mb-4 py-3 px-6 rounded-full flex items-center justify-center w-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50"
          >
            Request Access
          </button>
        )}
      </>
    );
  };

  const WithdrawAdd = () => {
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [contAmount, setContAmount] = useState("");

    const { mutateAsync: ContributeGroup } = useMutation({
      mutationFn: () =>
        createCommunityContribution({ community_id, amount: contAmount }),
      onSuccess: async () => {
        await invalidateCommunitySafes();
        await invalidateUserBalance();
        setShowContributeModal(false);
      },
    });

    return (
      <div className="flex w-full justify-center items-center gap-4">
        <button
          className="bg-[#FFC466] text-white mb-4 font-bold py-2 px-4 rounded-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50 mr-2"
          onClick={() => setShowContributeModal(true)}
        >
          Contribute
        </button>

        {showContributeModal && (
          <div className="fixed inset-0 bg-black p-2 bg-opacity-60 flex items-center justify-center">
            <div className="bg-[#173F8A] rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-bold mb-4">Group Contribution</h2>
              <input
                type="number"
                name="goal"
                placeholder="Goal Amount"
                className="bg-white text-black text-lg rounded-full py-2 w-full px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50 mr-2"
                value={contAmount}
                onChange={(e) => setContAmount(e.target.value)}
              />
              <div className="flex mt-4 justify-end">
                <button
                  className="bg-[#FFC466] text-white font-bold py-2 px-4 rounded-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50 mr-2"
                  onClick={ContributeGroup}
                >
                  Pay
                </button>
                <button
                  className="bg-[#7966FF] text-white font-bold py-2 px-4 rounded-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50"
                  onClick={() => setShowContributeModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const DisplayRequests = ({ requests }) => {
    const { mutateAsync: ApproveRequest } = useMutation({
      mutationFn: (data) => approveUserRequest(data),

      onSuccess: async () => {
        await invalidateCommunitySafes();
        await invalidateUserBalance();
      },
    });

    const { mutateAsync: CancelRequest } = useMutation({
      mutationFn: (data) => denyUserRequest(data),
      onSuccess: async () => {
        await invalidateCommunitySafes();
        await invalidateUserBalance();
      },
    });

    return (
      <div className="bg-[#F5E5E6] mb-4 rounded-lg p-4">
        <h1 className="text-black font-bold mb-2">Requests</h1>
        <div className="flex flex-col gap-2 justify-center items-center">
          {requests?.map((request, index) => (
            <div
              key={index}
              className="flex text-[11px] gap-2 justify-between items-center"
            >
              <span className="text-black">{request}</span>

              <div className="flex gap-1">
                <button
                  className="cursor-pointer p-1 rounded-full hover:bg-white"
                  onClick={() => CancelRequest({ community_id, user: request })}
                >
                  <RxCross2 color="red" size={16} />
                </button>

                <button className="cursor-pointer rounded-full p-1 hover:bg-white">
                  <TiTick
                    color="green"
                    size={16}
                    onClick={() =>
                      ApproveRequest({ community_id, user: request })
                    }
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FFFFFF] text-white min-h-screen">
      <header className="text-[#333333] py-4 px-6">
        <h1 className="text-2xl font-bold">Details</h1>
      </header>

      <main className="p-6">
        <div className="bg-[#173F8A] rounded-lg p-4 mb-4">
        <h1 className="text-2xl font-bold">{campaign && campaign[0]?.title}</h1>

          <p className="text-[#9FB7FF] mb-2">
            {campaign && campaign[0]?.description}
          </p>
          <div className="flex justify-between items-center mb-2">
            <span>
              Saved:{" "}
              <span className="font-bold">
                ${campaign && Number(campaign[0]?.currentAmount) / 1e18}
              </span>
            </span>
            <span>
              Goal:{" "}
              <span className="font-bold">
                ${campaign && Number(campaign[0]?.target) / 1e18}
              </span>
            </span>
          </div>
          <div className="bg-[#9FB7FF] rounded-full h-4">
            <div
              className="bg-[#FFC466] rounded-full h-full"
              style={{
                width: `${
                  (campaign &&
                    Number(campaign[0]?.currentAmount) /
                      Number(campaign[0]?.target)) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div>
          {campaign && campaign[0].communityAdmin == userAddress ? (
            campaign[0]?.newRequests.length > 0 ? (
              <DisplayRequests requests={campaign[0].newRequests} />
            ) : (
              <WithdrawAdd />
            )
          ) : campaign && campaign[0]?.members?.includes(userAddress) ? (
            <WithdrawAdd />
          ) : campaign && campaign[0]?.newRequests?.includes(userAddress) ? (
            <span className="text-black">Pending Access</span>
          ) : (
            <RequestAccess />
          )}
        </div>

        <div className="bg-[#173F8A] text-white rounded-lg p-4">
          <div className="flex flex-col gap-2 justify-center items-center mb-2">
            <span>Admin</span>
            <span className="text-[12px]">
              {campaign && campaign[0]?.communityAdmin}
            </span>
          </div>
          <h2 className="text-lg font-bold mb-2">Members</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-[12px]">Wallet Address</th>
                <th className="text-center text-[12px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {campaign &&
                campaign[0]?.tokenHolders &&
                campaign[0]?.members?.includes(userAddress) &&
                Object.keys(campaign[0]?.tokenHolders).map((address) => (
                  <tr key={address} className="border-b  border-[#9FB7FF]">
                    <td className="py-2 text-[11px]">{address}</td>
                    <td className="py-2 text-[11px]">
                      {Number(campaign[0]?.tokenHolders[address]) / 1e18}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default COmmGoalDetails;

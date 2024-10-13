import React, { useState } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import CUSDAbi from "../contracts/erc20.abi.json";
import CeloVestAbi from "../contracts/celovest.abi.json";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import {
  CeloVestContractAddress,
  cUSDContractAddress,
} from "../components/Utils/Constants";
import { formatSafeData } from "../components/Utils/functions";


//celo alfajores rpc
const useAuthentication = () => {
  const queryClient = useQueryClient();
  const ERC20_DECIMALS = 18;
  const navigate = useNavigate();

  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
      });

      let [address] = await walletClient.getAddresses();
      console.log(address);
      setAddress(address);
    }
  };

  async function getBalance() {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });
    let [address] = await walletClient.getAddresses();

    let bal = await publicClient.getBalance({
      address: address,
    });

    let balanceInEthers = formatEther(bal);

    setBalance(balanceInEthers);

    return bal;
  }



  const connectCeloWallet = async function () {
    if (window.ethereum) {
      console.log("windows object :", window.ethereum);
      try {
        setButtonLoading(true);

        const web3 = new Web3(window.ethereum);
        var kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        kit.defaultAccount = accounts[0];

        const celoVestContract = new kit.web3.eth.Contract(
          CeloVestAbi,
          CeloVestContractAddress
        );
        const cUSDContract = new kit.web3.eth.Contract(
          CUSDAbi,
          cUSDContractAddress
        );
        console.log("celovest contract :", celoVestContract);
        //get the total number of community projects
        const [balance, totalComm, mySafes] = await Promise.all([
          await cUSDContract.methods.balanceOf(accounts[0]).call(),
          await celoVestContract.methods.getTotalCommunityProjects().call(),
          await celoVestContract.methods.getMySafes().call(),
        ]);

        const testing = [];
        //for each of the total comm, get its details
        var details = [];
        for (let i = 0; i < totalComm; i++) {
          const results = await celoVestContract.methods
            .getCommDetails(i)
            .call();
          console.log("fres sh :", results);
          details.push({
            title: results[0],
            description: results[1],
            target: results[2],
            currentAmount: results[3],
            isActive: results[4],
            members: results[5],
            communityAdmin: results[6],
            newRequests: results[7],
          });
        }

        const safeData = formatSafeData(mySafes);
        console.log("all user safes :", safeData);
        console.log("community details :", details);

        //get all the safes for the use
        queryClient.setQueryData(["allCommunityDetails"], details);

        queryClient.setQueryData(["celoVestContract"], celoVestContract);

        queryClient.setQueryData(["cUSDContract"], cUSDContract);
        queryClient.setQueryData(["accountAddress"], accounts[0]);

        queryClient.setQueryData(["userBalance"], Number(balance) / 1e18);
        queryClient.setQueryData(["accountAddress"], accounts[0]);
        queryClient.setQueryData(["mySafes"], safeData);
        setButtonLoading(false);
        navigate("dashboard");
      } catch (error) {
        console.log("error in ggg :", error);
      }
    } else {
      //   notification("⚠️ Please install the CeloExtensionWallet.")
    }
  };

  const { data: cUSDContract } = useQuery({
    queryKey: ["cUSDContract"],
  });

  const { data: celoVestContract } = useQuery({
    queryKey: ["celoVestContract"],
  });

  const { data: accountAddress } = useQuery({
    queryKey: ["accountAddress"],
  });

  const compBot = useQuery({
    queryKey: ["userBalance"],
    queryFn: () => loadUserBalance(),
  });

  const comm = useQuery({
    queryKey: ["allCommunityDetails"],
    queryFn: () => loadCommunityData(),
  });

  const safes = useQuery({
    queryKey: ["mySafes"],
    queryFn: () => loadMySafes(),
  });

  const loadMySafes = async () => {
    if (!celoVestContract || !accountAddress) return;
    try {
      const results = await celoVestContract.methods.getMySafes().call();

      return await formatSafeData(results);
    } catch (error) {
      console.log("error in loading the user'sa safes :", error);
    }
  };

  const loadCommunityData = async () => {
    if (!celoVestContract) return;
    try {
      const totalComm = await celoVestContract.methods
        .getTotalCommunityProjects()
        .call();

      var details = [];
      for (let i = 0; i < totalComm; i++) {
        const results = await celoVestContract.methods.getCommDetails(i).call();
        details.push({
          title: results[0],
          description: results[1],
          target: results[2],
          currentAmount: results[3],
          isActive: results[4],
          members: results[5],
          communityAdmin: results[6],
          newRequests: results[7],
        });
      }
      return details;
    } catch (error) {
      console.log("errorn loading community data :", error);
    }
  };

  const loadUserBalance = async () => {
    try {
      if (!cUSDContract || !accountAddress) return;
      const dd = await cUSDContract.methods.balanceOf(accountAddress).call();
      return dd / 1e18;
    } catch (error) {
      console.log("erorr in fetching user balance");
    }
  };

  async function invalidateAccountBalance() {
    await queryClient.invalidateQueries(["userBalance"]);
  }

  async function invalidateCommunityData() {
    await queryClient.invalidateQueries(["allCommunityDetails"]);
  }

  async function invalidateMySafes() {
    await queryClient.invalidateQueries(["mySafes"]);
  }

  const [buttonLoading, setButtonLoading] = useState(false);

  const LoginButton = () => {
    return (
      <>
        {buttonLoading ? (
          <ClipLoader color="lightblue" />
        ) : (
         <button 
         onClick={getUserAddress}
         className="bg-[#FFC466] text-[#504C6B] font-bold py-3 px-6 rounded-full flex items-center justify-center w-full hover:bg-[#9FB7FF] focus:outline-none focus:ring-2 focus:ring-[#FFC466] focus:ring-opacity-50">
          <FaWallet className="mr-2" />
          Login with Wallet
        </button> 
        )}
      </>
    );
  };

  return {
    invalidateMySafes,
    LoginButton,
    address,
    getUserAddress,
    balance,
    getBalance,
  };
};

export default useAuthentication;

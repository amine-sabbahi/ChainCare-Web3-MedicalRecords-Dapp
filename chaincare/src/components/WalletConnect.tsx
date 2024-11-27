"use client";

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { CONTRACT_ADDRESSES, ABI } from "@/components/contracts"; // Update the path

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(
        ABI,
        CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER
      );
      setContract(contractInstance);
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        // Check if user is admin
        console.log(accounts[0])
        const isUserAdmin = await contract.methods.isAdmin(accounts[0]).call();
        console.log(isUserAdmin)

      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="p-4">
      {account ? (
        <div>
          <p>Connected: {account}</p>

        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;

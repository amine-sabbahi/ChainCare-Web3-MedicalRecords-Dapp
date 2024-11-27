"use client";
import React, { useState } from 'react';

const WalletConnect: React.FC = () => {
    const [account, setAccount] = useState<string | null>(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Failed to connect wallet', error);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-200">
            {account ? (
                <p>Connected: {account}</p>
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
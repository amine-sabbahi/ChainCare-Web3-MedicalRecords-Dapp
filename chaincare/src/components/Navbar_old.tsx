"use client";

import React from 'react';
import Link from 'next/link';
import {useAuth} from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const handleDisconnect = () => {
    logout();
  };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Medical Records DApp
                </Link>

                <div className="space-x-4">
                    <button
                        onClick={handleDisconnect}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Disconnect
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
import React from 'react';
import Link from 'next/link';
import WalletConnect from "@/components/WalletConnect";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    Medical Records DApp
                </Link>

                <div className="space-x-4">
                    <Link href="/admin" className="hover:text-blue-200">Admin</Link>
                    <Link href="/patient" className="hover:text-blue-200">Patient</Link>
                    <Link href="/doctor" className="hover:text-blue-200">Doctor</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
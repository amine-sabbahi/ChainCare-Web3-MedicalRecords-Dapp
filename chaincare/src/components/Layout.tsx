import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import WalletConnect from './WalletConnect';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    );
};

export default Layout;
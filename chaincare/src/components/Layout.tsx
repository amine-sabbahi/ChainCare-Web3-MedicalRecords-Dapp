import React, { ReactNode } from 'react';
import Navbar from './Navbar_old';

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
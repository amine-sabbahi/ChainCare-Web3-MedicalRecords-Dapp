import React, { useState } from 'react';
import { Home, LogOut, ChevronLeft, ChevronRight, Users, Stethoscope, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import ChaincareLogo from "../../public/img/Chaincare_verticale-logo.png";

const SideBarPatient = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [removedItems, setRemovedItems] = useState([]);
  const pathname = usePathname();
  const { logout } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Function to check if the path is active
  const isActive = (paths) => paths.includes(pathname);

  // Navigation items with icons and labels
  const navigationItems = [
    { icon: <Users className="w-7 h-7" />, label: 'Profil', href: '/patient' },
    { icon: <LayoutDashboard className="w-7 h-7" />, label: 'Consult Medical Records', href: '/patient/records' },
    { icon: <Users className="w-7 h-7" />, label: 'Manage Permissions', href: '/patient/ManagePermissions' },
    { icon: <Stethoscope className="w-7 h-7" />, label: 'Historique', href: '/patient/historique' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#B3D0E1] to-[#D9E9F3] text-black shadow-lg transition-all duration-300 z-50 border-r border-gray-300 flex flex-col ${isCollapsed ? 'w-24' : 'w-96'}`}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-[-20px] bg-[#D0E3F3] text-black p-2 rounded-r-full shadow-xl hover:bg-[#B4D5E9] transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-7 h-7 group-hover:animate-pulse" />
          ) : (
            <ChevronLeft className="w-7 h-7 group-hover:animate-pulse" />
          )}
        </button>

        {/* Logo Area */}
        <div className="p-6 border-b border-gray-300 flex items-center justify-center bg-transparent">
          <div
            className={`transition-all ${isCollapsed ? 'w-14 h-14 overflow-hidden' : 'w-full'}`}
          >
            <Image
              src={ChaincareLogo}
              alt="ChainCare Logo"
              width={isCollapsed ? 50 : 220}
              height={isCollapsed ? 50 : 100}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow mt-6 space-y-5 px-4">
          {navigationItems
            .filter((item) => !removedItems.includes(item.href))
            .map((item, index) => (
              <div key={index} className="relative group">
                <a
                  href={item.href}
                  className={`flex items-center px-5 py-5 transition-all duration-300 ease-in-out transform hover:shadow-lg rounded-xl mx-3 group
                    ${isActive([item.href])
                      ? 'bg-[#4a90e2] text-white scale-105'
                      : 'hover:bg-[#e1f0f8] text-gray-800 hover:scale-105'}`}
                >
                  <span
                    className={`group-hover:text-white ${isActive([item.href]) ? 'text-white' : 'text-gray-600'}`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`ml-4 transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'} overflow-hidden whitespace-nowrap text-lg font-semibold`}
                  >
                    {item.label}
                  </span>
                </a>
              </div>
            ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-300 p-4 mt-auto">
          <button
            onClick={logout}
            className="flex items-center px-5 py-5 hover:bg-red-500 text-gray-800 transition-all duration-300 w-full rounded-xl group"
          >
            <LogOut className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span
              className={`ml-4 transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'} overflow-hidden whitespace-nowrap text-lg font-semibold group-hover:text-white`}
            >
              Disconnect
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBarPatient;

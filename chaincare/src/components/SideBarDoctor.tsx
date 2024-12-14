import React, { useState } from 'react';
import { LogOut, ChevronLeft, ChevronRight, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image/';
import ChaincareLogo from "../../public/img/Chaincare_verticale-logo.png"

const SideBarAdmin = ({children}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [removedItems, setRemovedItems] = useState([]);
  const pathname = usePathname();
  const { logout } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Function to check if the path is active
  const isActive = (paths) => paths.includes(pathname);

  // Navigation items with icons and labels
  const navigationItems = [
    {icon: <LayoutDashboard className="w-5 h-5"/>, label: 'Dashboard', href: '/doctor'},
    {icon: <User className="w-5 h-5"/>, label: 'Patients', href: '/doctor/view_patients'},
  ];

  return (
    <div className="flex flex-row h-screen">
      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full 
          bg-gradient-to-b from-[#2c3e50] to-[#34495e] 
          text-white shadow-2xl 
          transition-all duration-300 
          ${isCollapsed ? 'w-16' : 'w-64'}
          flex flex-col 
          z-50 
          border-r border-gray-700
        `}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={toggleSidebar}
          className="
            absolute top-4 right-[-20px]
            bg-[#34495e]
            text-white
            p-2
            rounded-r-full
            shadow-lg
            hover:bg-[#2c3e50]
            transition-colors
            group
          "
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 group-hover:animate-pulse"/>
          ) : (
            <ChevronLeft className="w-5 h-5 group-hover:animate-pulse"/>
          )}
        </button>

        {/* Logo Area */}
        <div className="p-4 border-b border-[#34495e] flex items-center justify-center">
          <div
            className={`
              transition-all 
              ${isCollapsed ? 'w-10 h-10 overflow-hidden' : 'w-full'}
              flex justify-center items-center
            `}
          >
            <Image
              src={ChaincareLogo}
              alt="ChainCare Logo"
              width={isCollapsed ? 40 : 220}
              height={isCollapsed ? 40 : 100}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow mt-4 space-y-1">
          {navigationItems
            .filter((item) => !removedItems.includes(item.href))
            .map((item, index) => (
              <div key={index} className="relative group">
                <a
                  href={item.href}
                  className={`
                    flex items-center 
                    px-4 py-3 
                    transition-all 
                    duration-300 
                    ease-in-out 
                    ${
                      isActive([item.href])
                        ? 'bg-[#3498db] text-white scale-105'
                        : 'hover:bg-[#34495e] text-gray-300 hover:scale-105'
                    }
                    transform 
                    hover:shadow-lg 
                    rounded-r-xl 
                    mx-2 
                    group
                  `}
                >
                  <span className={`
                    ${isActive([item.href]) ? 'text-white' : 'text-gray-400'}
                    group-hover:text-white
                    transition-colors
                  `}>
                    {item.icon}
                  </span>
                  <span
                    className={`
                      ml-3 
                      transition-all 
                      ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}
                      overflow-hidden 
                      whitespace-nowrap 
                      text-sm 
                      font-medium
                    `}
                  >
                    {item.label}
                  </span>
                </a>
              </div>
            ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-700 p-2">
          <button
            onClick={logout}
            className="
              flex items-center
              px-4 py-3
              hover:bg-gray-600
              text-gray-300
              transition-all
              duration-300
              w-full
              rounded-xl
              group
            "
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
            <span
              className={`
                ml-3 
                transition-all 
                ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'}
                overflow-hidden 
                whitespace-nowrap 
                text-m
                font-medium 
                group-hover:text-white
              `}
            >
              Disconnect
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`
          flex-auto 
          w-screen 
          h-screen 
          left-0 
          top-0 
          p-8 
          bg-gray-100 
          transition-all 
          duration-300 
          ${isCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default SideBarAdmin;
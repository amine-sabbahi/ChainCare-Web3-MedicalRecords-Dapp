import React, { useState } from 'react';
import { Home, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const SideBarAdmin = ({children}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [removedItems, setRemovedItems] = useState([]);
  const pathname = usePathname(); // Get the current path
  const { logout } = useAuth();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Function to check if the path is active
  const isActive = (paths) => paths.includes(pathname);

  return (
      <div className="flex flex-row h-screen">
        {/* Sidebar */}
        <div
            className={`fixed left-0 top-0 h-full bg-gray-800 text-white shadow-xl transition-all duration-300 ${
                isCollapsed ? 'w-16' : 'w-64'
            } flex flex-col z-50`}
        >
          {/* Collapse/Expand Button */}
          <button
              onClick={toggleSidebar}
              className="absolute top-4 right-[-20px] bg-gray-800 p-2 rounded-full shadow-md border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5"/> : <ChevronLeft className="w-5 h-5"/>}
          </button>

          {/* Logo Area */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-center">
            <h1
                className={`font-bold text-xl transition-all ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'
                } overflow-hidden`}
            >
              Dashboard
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-grow mt-4 space-y-1">
            {[
              {icon: <Home className="w-5 h-5"/>, label: 'Patients', href: '/admin/patients'},
            ]
                .filter((item) => !removedItems.includes(item.href)) // Exclude removed items
                .map((item, index) => (
                    <div key={index} className="relative group">
                      <a
                          href={item.href}
                          className={`flex items-center px-4 py-3 transition-colors ${
                              isActive(['/admin/patients', '/admin/createPatient'])
                                  ? 'bg-blue-600 text-white'
                                  : 'hover:bg-gray-800 text-gray-300'
                          }`}
                      >
                        {item.icon}
                        <span
                            className={`ml-3 transition-all ${
                                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'
                            } overflow-hidden whitespace-nowrap`}
                        >
                    {item.label}
                  </span>
                      </a>
                    </div>
                ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-700 p-2 space-y-1">
            <button
                onClick={logout}
                className="flex items-center px-4 py-3 hover:bg-gray-800 text-gray-300 transition-colors w-full"
            >
              <LogOut className="w-5 h-5"/>
              <span
                  className={`ml-3 transition-all ${
                      isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-full'
                  } overflow-hidden whitespace-nowrap`}
              >
              Logout
            </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
            className={`flex-auto w-screen h-screen left-0 top-0 p-8 bg-gray-100 transition-all duration-300 ${
                isCollapsed ? 'ml-16' : 'ml-64'
            }`}
        >
          {children}
        </div>
      </div>
  );
};

export default SideBarAdmin;

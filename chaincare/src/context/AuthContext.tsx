"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import {usePathname, useRouter} from 'next/navigation';
import { Contract, providers } from 'ethers';
import { CONTRACT_ADDRESSES, ABI } from "@/components/contracts";
import Web3 from "web3";



// Define the shape of our authentication context
interface AuthContextType {
  user: {
    address: string | null;
    role: 'admin' | 'patient';
    isAuthenticated: boolean;
  };
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: {
    address: null,
    role: 'patient',
    isAuthenticated: false,
  },
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    address: null as string | null,
    role: 'patient' as 'admin' | 'patient',
    isAuthenticated: false,
  });
  const router = useRouter();
  const pathname = usePathname()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const decoded = parseJwt(token);

          // Validate token expiration
          if (decoded.exp * 1000 > Date.now()) {
            setUser({
              address: decoded.address,
              role: decoded.role,
              isAuthenticated: true,
            });

            // Avoid infinite redirect loop by checking the current route
            if (decoded.role === 'admin' && pathname !== '/admin') {
              router.push('/admin');
            } else if (decoded.role === 'patient' && pathname !== '/patient') {
              router.push('/patient');
            }

          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
        }
      }
    };
    checkAuth();
  }, [pathname]); // Dependency on pathname

  const login = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        const provider = new Web3(window.ethereum);

        const contract = new provider.eth.Contract(ABI, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL);
        const isAdmin = await contract.methods.isAdmin(connectedAccount).call();
        const role = isAdmin ? 'admin' : 'patient';
        const token = generateJWT(connectedAccount, role);

        localStorage.setItem('auth_token', token);
        setUser({
          address: connectedAccount,
          role,
          isAuthenticated: true,
        });

        // Avoid infinite redirect loop by checking the current route
        if (role === 'admin' && router.pathname !== '/admin') {
          router.push('/admin');
        } else if (role === 'patient' && router.pathname !== '/patient') {
          router.push('/patient');
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser({
      address: null,
      role: 'patient',
      isAuthenticated: false,
    });
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// JWT Utilities
function generateJWT(address: string, role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      address,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    })
  );
  const signature = btoa(`${header}.${payload}`); // Simplified

  return `${header}.${payload}.${signature}`;
}

function parseJwt(token: string): any {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

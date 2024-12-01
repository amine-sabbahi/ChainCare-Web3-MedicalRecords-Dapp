"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CONTRACT_ADDRESSES, ABI } from "@/components/contracts";
import Web3 from "web3";

// Define the shape of our authentication context
interface AuthContextType {
  user: {
    address: string | null;
    role: 'admin' | 'patient';
    isAuthenticated: boolean;
  };
  loading: boolean;  // Add loading to the context type
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: {
    address: null,
    role: 'patient',
    isAuthenticated: false,
  },
  loading: false, // Default to false
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    address: null as string | null,
    role: 'patient' as 'admin' | 'patient',
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true); // Manage loading state
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true); // Set loading to true
      try {
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
            console.error('Failed to parse token:', error);
            localStorage.removeItem('auth_token');
          }
        }
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };
    checkAuth();
  }, [pathname, router]);

  const login = async () => {
    setLoading(true); // Set loading to true during login
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      setLoading(false); // Ensure loading stops if MetaMask isn't installed
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

        if (role === 'admin' && pathname !== '/admin') {
          router.push('/admin');
        } else if (role === 'patient' && pathname !== '/patient') {
          router.push('/patient');
        }
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setLoading(false); // Ensure loading stops after login
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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

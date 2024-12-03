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
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: {
    address: null,
    role: 'patient',
    isAuthenticated: false,
  },
  loading: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    address: null as string | null,
    role: 'patient' as 'admin' | 'patient',
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

useEffect(() => {
  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const decoded = parseJwt(token);

        if (decoded.exp * 1000 > Date.now()) {
          // Only update user state if not already authenticated
          setUser(prevUser => {
            if (!prevUser.isAuthenticated) {
              return {
                address: decoded.address,
                role: decoded.role,
                isAuthenticated: true,
              };
            }
            return prevUser;
          });

          // Redirect logic
          if (decoded.role === 'admin' && pathname !== '/admin') {
            //router.push('/admin');
          } else if (decoded.role === 'patient' && pathname !== '/patient') {
            //router.push('/patient');
          }
        } else {
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      console.error('Error during authentication check:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, [pathname, router]);

  const login = async () => {
    setLoading(true);
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      setLoading(false);
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        const provider = new Web3(window.ethereum);
        const contract = new provider.eth.Contract(ABI.MEDICAL_ACCESS_CONTROL, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL);
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
      setLoading(false);
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

function generateJWT(address: string, role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      address,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    })
  );
  const signature = btoa(`${header}.${payload}`);
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

export const useAuth = () => {
  return useContext(AuthContext);
};

"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CONTRACT_ADDRESSES, ABI } from "@/components/contracts";
import Web3 from "web3";

// Define the shape of our authentication context
interface AuthContextType {
  user: {
    address: string | null;
    role: 'admin' | 'patient'| 'doctor';
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
            setUser({
              address: decoded.address,
              role: decoded.role,
              isAuthenticated: true,
            });

            // Only redirect if on an incompatible route
            if (
              (decoded.role === 'admin' && !pathname.startsWith('/admin')) ||
              (decoded.role === 'patient' && !pathname.startsWith('/patient')) ||
              (decoded.role === 'doctor' && !pathname.startsWith('/doctor'))
            ) {
              router.push(decoded.role === 'admin' ? '/admin' : '/patient : /doctor');
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

        // Retrieve roles from the contract
        const isAdmin = await contract.methods.isAdmin(connectedAccount).call();
        const isDoctor = await contract.methods.isDoctor(connectedAccount).call();

        // Determine user role
        let role = 'patient'; // Default role
        if (isAdmin) {
            role = 'admin';
        } else if (isDoctor) {
            role = 'doctor';
        }

        // Generate a JWT token based on the role
        const token = generateJWT(connectedAccount, role);

        // Save token and user info in local storage
        localStorage.setItem('auth_token', token);
        setUser({
            address: connectedAccount,
            role: role,
            isAuthenticated: true,
        });

        // Redirect based on the role
        if (role === 'admin' && pathname !== '/admin') {
            router.push('/admin');
        } else if (role === 'doctor' && pathname !== '/doctor') {
            router.push('/doctor');
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
"use client";

import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import SideBarAdmin from "@/components/SideBarAdmin";

export default function Home() {
  const router = useRouter();
  const { user, login, logout, loading } = useAuth();

  const handleDisconnect = () => {
    logout();
  };

  return (

      <SideBarAdmin>
          <button onClick={handleDisconnect}>Logout</button>
      </SideBarAdmin>c

  );
}

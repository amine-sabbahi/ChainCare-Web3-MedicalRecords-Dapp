"use client";

import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, login, logout, loading } = useAuth();

  const handleDisconnect = () => {
    logout();
  };

  return (
    <Layout>
        <button onClick={logout}>Logout</button>
    </Layout>
  );
}

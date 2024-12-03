"use client";

import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { user, login, logout, loading } = useAuth();

  const handleDisconnect = () => {
    logout();
  };

  return (
      <Layout>
        <button className={"px-4 py-2 bg-blue-500 text-white rounded"}
                onClick={() => router.push('/admin/createPatient')}>Create Patient
        </button>
        <button onClick={handleDisconnect}>Logout</button>
      </Layout>
  );
}

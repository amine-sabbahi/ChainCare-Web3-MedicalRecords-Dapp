"use client";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import CenteredLoader from "@/components/Loading";

export default function Home() {
  const { user, login, logout, loading } = useAuth();

  const handleDisconnect = () => {
    logout();
  };

  return (
    <Layout>
      {loading ? (
        <CenteredLoader size={100} />
      ) : (
        <div>
          <p className="text-black">
            Welcome, {user.isAuthenticated ? user.address : "Guest"}
          </p>
          {!user.isAuthenticated ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={login}
              disabled={loading}
            >
              Connect
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Disconnect
            </button>
          )}
        </div>
      )}
    </Layout>
  );
}

"use client";

import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, login, logout } = useAuth(); // Combine both calls to useAuth()

  const handleDisconnect = () => {
    logout(); // Call the logout function to clear the auth state and redirect
  };

  return (
    <Layout>
      <div>
        <p className={"text-black"}>Welcome, {user.isAuthenticated ? user.address : "Guest"}</p>
        {!user.isAuthenticated && <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={login}>Login</button>}
        {/* Only show Disconnect button if the user is authenticated */}
        {user.isAuthenticated && (
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect
          </button>
        )}
      </div>
    </Layout>
  );
}

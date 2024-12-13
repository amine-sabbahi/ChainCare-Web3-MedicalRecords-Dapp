"use client";

import { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function Admins() {
  const router = useRouter();
  const { user, login, logout, loading } = useAuth();

  // State to store admins' data and modal visibility
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    address: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  // Fetch the list of admins
  useEffect(() => {
    const fetchAdmins = async () => {
      if (!window.ethereum) {
        alert("Ethereum provider is not available. Please install MetaMask.");
        return;
      }

      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(ABI.MEDICAL_ACCESS_CONTROL, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL);

      try {
        const adminAddresses = await contract.methods.getAllAdminsDetails().call();
        const allAdmins = await Promise.all(
          adminAddresses.map(async (admin, index) => {
            // Get the corresponding address from the allAdmins method
            const adminAddress = await contract.methods.allAdmins(index).call();
            return {
              address: adminAddress, // Include the full address
              fullName: admin.fullName,
              email: admin.email,
              phoneNumber: admin.phoneNumber,
              isActive: admin.isActive,
              registrationTimestamp: admin.registrationTimestamp
            };
          })
        );
        setAdmins(allAdmins);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  // Handle input changes for new admin
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value
    });
  };

  // Handle submit to add a new admin
  const handleAddAdmin = async () => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }

    // Validate Ethereum address
    if (!Web3.utils.isAddress(newAdmin.address)) {
      alert("Invalid Ethereum address.");
      return;
    }

    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.MEDICAL_ACCESS_CONTROL, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL);

    try {
      const accounts = await provider.eth.getAccounts();
      await contract.methods.addAdmin(
        newAdmin.address,
        newAdmin.fullName,
        newAdmin.email,
        newAdmin.phoneNumber
      ).send({ from: accounts[0] });

      // Close modal after adding admin
      setIsModalOpen(false);

      // Re-fetch admins list
      const adminAddresses = await contract.methods.getAllAdminsDetails().call();
      const allAdmins = await Promise.all(
        adminAddresses.map(async (admin, index) => {
          const adminAddress = await contract.methods.allAdmins(index).call();
          return {
            address: adminAddress,
            fullName: admin.fullName,
            email: admin.email,
            phoneNumber: admin.phoneNumber,
            isActive: admin.isActive,
            registrationTimestamp: admin.registrationTimestamp
          };
        })
      );
      setAdmins(allAdmins);
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  // Function to truncate Ethereum address for display
  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <SideBarAdmin>
      <h1 className="text-3xl font-bold text-left text-black my-6">Admins Registry</h1>

      {/* Add Admin Button */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
      >
        Add Admin
      </button>

      {/* Admins Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
  <tr>
    <th scope="col" className="px-6 py-3 w-[1000px]">Address</th>
    <th scope="col" className="px-6 py-3 w-1/4">Admin Name</th>
    <th scope="col" className="px-6 py-3 w-1/4">Email</th>
    <th scope="col" className="px-6 py-3 w-1/6">Phone Number</th>
  </tr>
</thead>
        <tbody>
        {admins.map((admin, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4 w-[1000px]">
                <span 
                title={admin.address} 
                className="cursor-help hover:text-blue-600"
                >
                {truncateAddress(admin.address)}
                </span>
            </td>
            <td className="px-6 py-4 w-1/4">{admin.fullName}</td>
            <td className="px-6 py-4 w-1/4">{admin.email}</td>
            <td className="px-6 py-4 w-1/6">{admin.phoneNumber}</td>
            </tr>
        ))}
        </tbody>
        </table>
      </div>

      {/* Modal for Adding Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="address"
                placeholder="Admin Address"
                value={newAdmin.address || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="name"
                placeholder="Admin Name"
                value={newAdmin.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newAdmin.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={newAdmin.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddAdmin}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SideBarAdmin>
  );
}
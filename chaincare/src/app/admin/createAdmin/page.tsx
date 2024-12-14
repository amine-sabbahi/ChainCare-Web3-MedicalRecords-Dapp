'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function Admins() {
  const router = useRouter();
  const { user, login, logout, loading } = useAuth();

  // State to store admins' data, modal visibility, and delete confirmation
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    address: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

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
        const rawResult = await contract.methods.getAllAdminsDetails().call();
  
        let adminAddresses, adminDetails;
  
        if (Array.isArray(rawResult)) {
          [adminAddresses, adminDetails] = rawResult;
        } else if (typeof rawResult === 'object') {
          adminAddresses = rawResult[0] || [];
          adminDetails = rawResult[1] || [];
        } else {
          throw new Error('Unexpected return type from getAllAdminsDetails');
        }
  
        const processedAdmins = adminAddresses.map((address, index) => ({
          address: address || '', 
          fullName: adminDetails[index]?.fullName || '',
          email: adminDetails[index]?.email || '',
          phoneNumber: adminDetails[index]?.phoneNumber || '',
          isActive: adminDetails[index]?.isActive || false,
          registrationTimestamp: adminDetails[index]?.registrationTimestamp || 0
        }));
  
        setAdmins(processedAdmins);
      } catch (error) {
        console.error("Detailed error fetching admins:", error);
        alert(`Failed to fetch admins: ${error.message}`);
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

  // Handle opening modification modal
  const handleModifyAdmin = (admin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      address: admin.address,
      fullName: admin.fullName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Handle delete admin
  const handleDeleteAdmin = async () => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }

    const adminAddress = adminToDelete;

    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.MEDICAL_ACCESS_CONTROL, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL);

    try {
      const accounts = await provider.eth.getAccounts();
      
      // Call removeAdmin method
      await contract.methods.removeAdmin(adminAddress).send({ from: accounts[0] });

      // Re-fetch admins list
      const rawResult = await contract.methods.getAllAdminsDetails().call();
      
      let adminAddresses, adminDetails;

      if (Array.isArray(rawResult)) {
        [adminAddresses, adminDetails] = rawResult;
      } else if (typeof rawResult === 'object') {
        adminAddresses = rawResult[0] || [];
        adminDetails = rawResult[1] || [];
      } else {
        throw new Error('Unexpected return type from getAllAdminsDetails');
      }

      const processedAdmins = adminAddresses.map((address, index) => ({
        address: address || '', 
        fullName: adminDetails[index]?.fullName || '',
        email: adminDetails[index]?.email || '',
        phoneNumber: adminDetails[index]?.phoneNumber || '',
        isActive: adminDetails[index]?.isActive || false,
        registrationTimestamp: adminDetails[index]?.registrationTimestamp || 0
      }));

      setAdmins(processedAdmins);

      setShowDeleteModal(false); // Close the delete confirmation modal

      alert('Admin successfully removed.');
    } catch (error) {
      console.error("Detailed error removing admin:", error);
      alert(`Failed to remove admin: ${error.message}`);
    }
  };

  // Handle submit to add or modify admin
  const handleSubmitAdmin = async () => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }

    // Validate inputs
    if (!newAdmin.address || !newAdmin.fullName || !newAdmin.email || !newAdmin.phoneNumber) {
      alert('Please fill out all fields.');
      return;
    }

    if (!Web3.utils.isAddress(newAdmin.address)) {
      alert("Invalid Ethereum address.");
      return;
    }

    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.MEDICAL_ACCESS_CONTROL, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL);

    try {
      const accounts = await provider.eth.getAccounts();
      
      if (isEditMode) {
        // Update admin details
        await contract.methods.updateAdminDetails(
          newAdmin.address,
          newAdmin.fullName,
          newAdmin.email,
          newAdmin.phoneNumber
        ).send({ from: accounts[0] });
      } else {
        // Add new admin
        await contract.methods.addAdmin(
          newAdmin.address,
          newAdmin.fullName,
          newAdmin.email,
          newAdmin.phoneNumber
        ).send({ from: accounts[0] });
      }

      // Close modal after adding/updating admin
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedAdmin(null);

      // Re-fetch admins list
      const rawResult = await contract.methods.getAllAdminsDetails().call();
      
      let adminAddresses, adminDetails;

      if (Array.isArray(rawResult)) {
        [adminAddresses, adminDetails] = rawResult;
      } else if (typeof rawResult === 'object') {
        adminAddresses = rawResult[0] || [];
        adminDetails = rawResult[1] || [];
      } else {
        throw new Error('Unexpected return type from getAllAdminsDetails');
      }

      const processedAdmins = adminAddresses.map((address, index) => ({
        address: address || '', 
        fullName: adminDetails[index]?.fullName || '',
        email: adminDetails[index]?.email || '',
        phoneNumber: adminDetails[index]?.phoneNumber || '',
        isActive: adminDetails[index]?.isActive || false,
        registrationTimestamp: adminDetails[index]?.registrationTimestamp || 0
      }));

      setAdmins(processedAdmins);
    } catch (error) {
      console.error("Detailed error submitting admin:", error);
      alert(`Failed to submit admin: ${error.message}`);
    }
  };

  // Helper function to format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <SideBarAdmin>
      <h1 className="text-3xl font-bold text-left text-black my-6">Admins Registry</h1>

      {/* Add Admin Button */}
      <button 
        onClick={() => {
          setIsEditMode(false);
          setNewAdmin({ address: '', fullName: '', email: '', phoneNumber: '' });
          setIsModalOpen(true);
        }} 
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
      >
        Add Admin
      </button>

      {/* Admins Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 w-1/5">Address</th>
            <th scope="col" className="px-6 py-3 w-1/5">Admin Name</th>
            <th scope="col" className="px-6 py-3 w-1/5">Email</th>
            <th scope="col" className="px-6 py-3 w-1/5">Phone Number</th>
            <th scope="col" className="px-6 py-3 w-1/5">Registry Time</th>
            <th scope="col" className="px-6 py-3 w-1/5">Actions</th>
          </tr>
        </thead>
        <tbody>
        {admins.map((admin, index) => (
          <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="px-6 py-4">{admin.address}</td>
            <td className="px-6 py-4">{admin.fullName}</td>
            <td className="px-6 py-4">{admin.email}</td>
            <td className="px-6 py-4">{admin.phoneNumber}</td>
            <td className="px-6 py-4">{formatDate(admin.registrationTimestamp)}</td>
            <td className="px-6 py-4 space-x-2">
              <button 
                onClick={() => handleModifyAdmin(admin)}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Modify
              </button>
              <button 
                onClick={() => {
                  setAdminToDelete(admin.address);
                  setShowDeleteModal(true);
                }}
                className="text-red-600 hover:text-red-800 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to remove the admin with address {adminToDelete}?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal remains the same for Add/Modify Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? 'Modify Admin' : 'Add New Admin'}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="address"
                value={newAdmin.address}
                onChange={handleInputChange}
                placeholder="Admin Address"
                className="w-full p-2 border rounded"
                disabled={isEditMode}
              />
              <input
                type="text"
                name="fullName"
                value={newAdmin.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={newAdmin.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAdmin}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditMode ? 'Save Changes' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SideBarAdmin>
  );
}

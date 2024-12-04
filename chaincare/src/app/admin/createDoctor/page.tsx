// createDoctor/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function Doctors() {
  const router = useRouter();
  const { user, login, logout, loading } = useAuth();

  // State to store doctors' data and modal visibility
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    address: '',  // Fix the key name to "address"
    name: '',
    specialization: '',
    email: '',
    phoneNumber: '',
    qualifications: '',
  });

  // Fetch the list of doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!window.ethereum) {
        alert("Ethereum provider is not available. Please install MetaMask.");
        return;
      }

      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);

      try {
        const doctorAddresses = await contract.methods.getAllRegisteredDoctors().call();
        const doctorsData = await Promise.all(doctorAddresses.map(async (address) => {
          const doctorProfile = await contract.methods.getDoctorProfile(address).call();
          return {
            address,
            ...doctorProfile
          };
        }));
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Handle disconnect
  const handleDisconnect = () => {
    logout();
  };

  // Handle input changes for new doctor
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({
      ...newDoctor,
      [name]: value
    });
  };

  // Handle submit to add a new doctor
  const handleAddDoctor = async () => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }

    // Validate Ethereum address
    if (!Web3.utils.isAddress(newDoctor.address)) {
      alert("Invalid Ethereum address.");
      return;
    }

    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);

    try {
      const accounts = await provider.eth.getAccounts();
      await contract.methods.registerDoctor(
        newDoctor.address,  // Ensure the address is valid
        newDoctor.name,
        newDoctor.specialization,
        newDoctor.email,
        newDoctor.phoneNumber,
        newDoctor.qualifications.split(',')
      ).send({ from: accounts[0] });

      // Close modal after adding doctor
      setIsModalOpen(false);

      // Re-fetch doctors list
      const doctorAddresses = await contract.methods.getAllRegisteredDoctors().call();
      const doctorsData = await Promise.all(doctorAddresses.map(async (address) => {
        const doctorProfile = await contract.methods.getDoctorProfile(address).call();
        return {
          address,
          ...doctorProfile
        };
      }));
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  return (
    <SideBarAdmin>
      <h1 className="text-3xl font-bold text-left text-black my-6">Doctors Registry</h1>

      {/* Add Doctor Button */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
      >
        Add Doctor
      </button>

      {/* Doctors Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Doctor Name</th>
              <th scope="col" className="px-6 py-3">Specialization</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-6 py-3">Qualifications</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{doctor.name}</td>
                <td className="px-6 py-4">{doctor.specialization}</td>
                <td className="px-6 py-4">{doctor.email}</td>
                <td className="px-6 py-4">{doctor.phoneNumber}</td>
                <td className="px-6 py-4">{doctor.qualifications.join(", ")}</td>
                <td className="px-6 py-4">
                  {doctor.isActive ? (
                    <span className="text-green-500 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
            <form className="space-y-4">
            <input
                type="text"
                name="address"
                placeholder="Doctor Address"
                value={newDoctor.address || ''} 
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="name"
                placeholder="Doctor Name"
                value={newDoctor.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={newDoctor.specialization}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newDoctor.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newDoctor.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="qualifications"
                placeholder="Qualifications (comma separated)"
                value={newDoctor.qualifications}
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
                  onClick={handleAddDoctor}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SideBarAdmin>
  );
}

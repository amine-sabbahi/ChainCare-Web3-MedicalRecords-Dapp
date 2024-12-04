"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from "web3";
import { useAuth } from "@/context/AuthContext";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function CreateDoctorPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Form state to manage input values for the doctor
  const [doctorInfo, setDoctorInfo] = useState({
    doctorAddress: '',
    name: '',
    specialization: '',
    email: '',
    phoneNumber: '',
    qualifications: ['']
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "qualifications") {
      setDoctorInfo({
        ...doctorInfo,
        [name]: value.split(',') // Convert the comma-separated qualifications into an array
      });
    } else {
      setDoctorInfo({
        ...doctorInfo,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }

    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);

    // Make sure the user is connected to the wallet
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];

    // Prepare the parameters for the transaction
    const { doctorAddress, name, specialization, email, phoneNumber, qualifications } = doctorInfo;

    // Ensure doctorAddress is not empty or invalid
    if (!Web3.utils.isAddress(doctorAddress)) {
      alert("Invalid doctor address.");
      return;
    }

    try {
      // Send the transaction with the estimated gas
      const tx = await contract.methods.registerDoctor(
        doctorAddress,
        name,
        specialization,
        email,
        phoneNumber,
        qualifications
      ).send({ from: userAddress });

      // Handle successful registration
      alert("Doctor successfully registered!");

      // Optionally, redirect or reset the form
      router.push("/doctor-dashboard");
      setDoctorInfo({
        doctorAddress: '',
        name: '',
        specialization: '',
        email: '',
        phoneNumber: '',
        qualifications: ['']
      });

    } catch (error) {
      console.error("Error registering doctor:", error);
      alert("There was an error during registration. Please try again.");
    }
  };

  return (
    <SideBarAdmin>
      <h1 className="text-3xl font-bold text-left text-black my-6 mt-1">Doctor Registration</h1>

      {/* Registration form */}
      <form onSubmit={handleSubmit} className="max-w-lg p-6 border max-w-full h-max border-gray-300 rounded-lg shadow-lg bg-white">
        <div className="mb-4">
          <label htmlFor="doctorAddress" className="block text-sm font-medium text-gray-700">Doctor Address</label>
          <input
            type="text"
            id="doctorAddress"
            name="doctorAddress"
            value={doctorInfo.doctorAddress}
            onChange={handleChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={doctorInfo.name}
            onChange={handleChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={doctorInfo.specialization}
            onChange={handleChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={doctorInfo.email}
            onChange={handleChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={doctorInfo.phoneNumber}
            onChange={handleChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Qualifications (comma separated)</label>
          <input
            type="text"
            id="qualifications"
            name="qualifications"
            value={doctorInfo.qualifications.join(', ')} // Display as a comma-separated string
            onChange={handleChange}
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register Doctor
        </button>
      </form>
    </SideBarAdmin>
  );
}

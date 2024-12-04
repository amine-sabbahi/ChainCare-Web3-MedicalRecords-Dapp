"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Web3 from "web3";
import { useAuth } from "@/context/AuthContext";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function CreatePatientPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Form state to manage input values
  const [patientInfo, setPatientInfo] = useState({
    patientAddress: '',
    name: '',
    age: '',
    gender: '',
    email: '',
    phoneNumber: ''
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({
      ...patientInfo,
      [name]: value
    });
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!window.ethereum) {
    alert("Ethereum provider is not available. Please install MetaMask.");
    return;
  }

  const provider = new Web3(window.ethereum);
  const contract = new provider.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);

  // Make sure the user is connected to the wallet
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const userAddress = accounts[0];

  // Prepare the parameters for the transaction
  const { patientAddress, name, age, gender, email, phoneNumber } = patientInfo;

  // Ensure patientAddress is not empty or invalid
  if (!Web3.utils.isAddress(patientAddress)) {
    alert("Invalid patient address.");
    return;
  }

  try {
    // Send the transaction with the estimated gas
    const tx = await contract.methods.registerPatient(
      patientAddress,
      name,
      age,
      gender,
      email,
      phoneNumber
    ).send({ from: userAddress , gas: "17989"});

    // Handle successful registration
    alert("Patient successfully registered!");

    // Optionally, redirect or reset the form
    router.push("/patient-dashboard");
    setPatientInfo({
      patientAddress: '',
      name: '',
      age: '',
      gender: '',
      email: '',
      phoneNumber: ''
    });

  } catch (error) {
    console.error("Error registering patient:", error);
    alert("There was an error during registration. Please try again.");
  }
};


  return (

      <SideBarAdmin>
        <h1 className="text-3xl font-bold text-left text-black my-6 mt-1">Patient Registration</h1>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="max-w-lg p-6 border max-w-full h-max border-gray-300 rounded-lg shadow-lg bg-white">
          <div className="mb-4">
            <label htmlFor="patientAddress" className="block text-sm font-medium text-gray-700">Patient Address</label>
            <input
                type="text"
                id="patientAddress"
                name="patientAddress"
                value={patientInfo.patientAddress}
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
                value={patientInfo.name}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
                type="number"
                id="age"
                name="age"
                value={patientInfo.age}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
                id="gender"
                name="gender"
                value={patientInfo.gender}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={patientInfo.email}
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
                value={patientInfo.phoneNumber}
                onChange={handleChange}
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
          </div>

          <button type="submit"
                  className="p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Register Patient
          </button>
        </form>
      </SideBarAdmin>

  );
}

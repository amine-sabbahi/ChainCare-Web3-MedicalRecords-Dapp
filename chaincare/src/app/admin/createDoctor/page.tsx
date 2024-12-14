"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Web3 from "web3";
import { useAuth } from "@/context/AuthContext";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function DoctorsRegistryPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // State to store doctors' data and modal visibility
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    doctorAddress: "",
    name: "",
    specialization: "",
    email: "",
    phoneNumber: "",
    qualifications: "",
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
        const doctorsData = await Promise.all(
          doctorAddresses.map(async (address) => {
            const doctorProfile = await contract.methods.getDoctorProfile(address).call();
            return {
              address,
              ...doctorProfile,
            };
          })
        );
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Handle input changes for new doctor
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({
      ...newDoctor,
      [name]: value,
    });
  };

  // Add Doctor
  const handleAddDoctor = async () => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }

    // Validate Ethereum address
    if (!Web3.utils.isAddress(newDoctor.doctorAddress)) {
      alert("Invalid Ethereum address.");
      return;
    }

    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);

    try {
      const accounts = await provider.eth.getAccounts();
      await contract.methods.registerDoctor(
        newDoctor.doctorAddress,
        newDoctor.name,
        newDoctor.specialization,
        newDoctor.email,
        newDoctor.phoneNumber,
        newDoctor.qualifications.split(',').map(q => q.trim())
      ).send({ from: accounts[0] });

      // Close modal and reset form
      setIsModalOpen(false);
      setNewDoctor({
        doctorAddress: "",
        name: "",
        specialization: "",
        email: "",
        phoneNumber: "",
        qualifications: "",
      });

      // Refresh doctors list
      const doctorAddresses = await contract.methods.getAllRegisteredDoctors().call();
      const doctorsData = await Promise.all(
        doctorAddresses.map(async (address) => {
          const doctorProfile = await contract.methods.getDoctorProfile(address).call();
          return {
            address,
            ...doctorProfile,
          };
        })
      );
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor. Please try again.");
    }
  };

  // Delete Doctor
  const handleDeleteDoctor = async (doctorAddress) => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }
    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);
    try {
      const accounts = await provider.eth.getAccounts();
      // Note: You'll need to implement a deleteDoctor method in your contract
      // This is a placeholder and should be replaced with the actual contract method
      await contract.methods.updateDoctorProfile(
        doctorAddress,
        "", // empty name to effectively "delete"
        "", // empty specialization
        "", // empty email
        "", // empty phone number
        [] // empty qualifications
      ).send({ from: accounts[0] });

      setDoctors((prev) => prev.filter((doctor) => doctor.address !== doctorAddress));
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor. Please try again.");
    }
  };

  // Modify Doctor
  const handleModifyDoctor = async () => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }

    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);

    try {
      const accounts = await provider.eth.getAccounts();
      await contract.methods.updateDoctorProfile(
        newDoctor.doctorAddress,
        newDoctor.name,
        newDoctor.specialization,
        newDoctor.email,
        newDoctor.phoneNumber,
        newDoctor.qualifications.split(',').map(q => q.trim())
      ).send({ from: accounts[0] });

      // Close modal and reset form
      setIsModalOpen(false);
      setIsModifying(false);
      setNewDoctor({
        doctorAddress: "",
        name: "",
        specialization: "",
        email: "",
        phoneNumber: "",
        qualifications: "",
      });

      // Refresh doctors list
      const doctorAddresses = await contract.methods.getAllRegisteredDoctors().call();
      const doctorsData = await Promise.all(
        doctorAddresses.map(async (address) => {
          const doctorProfile = await contract.methods.getDoctorProfile(address).call();
          return {
            address,
            ...doctorProfile,
          };
        })
      );
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error modifying doctor:", error);
      alert("Failed to modify doctor. Please try again.");
    }
  };

  // Prepare doctor for modification
  const prepareModifyDoctor = (doctor) => {
    setNewDoctor({
      doctorAddress: doctor.address,
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      qualifications: doctor.qualifications.join(", "),
    });
    setIsModifying(true);
    setIsModalOpen(true);
  };

  return (
    <SideBarAdmin>
      <h1 className="text-3xl font-bold text-left text-black my-6">Doctors Registry</h1>
      <button
        onClick={() => {
          setNewDoctor({
            doctorAddress: "",
            name: "",
            specialization: "",
            email: "",
            phoneNumber: "",
            qualifications: "",
          });
          setIsModifying(false);
          setIsModalOpen(true);
        }}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
      >
        Add Doctor
      </button>

      {/* Doctors Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Doctor Address</th>
              <th className="px-6 py-3">Doctor Name</th>
              <th className="px-6 py-3">Specialization</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone Number</th>
              <th className="px-6 py-3">Qualifications</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{`${doctor.address.slice(0, 4)}...${doctor.address.slice(-4)}`}</td>
                <td className="px-6 py-4">{doctor.name}</td>
                <td className="px-6 py-4">{doctor.specialization}</td>
                <td className="px-6 py-4">{doctor.email}</td>
                <td className="px-6 py-4">{doctor.phoneNumber}</td>
                <td className="px-6 py-4">{doctor.qualifications.join(", ")}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => prepareModifyDoctor(doctor)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor.address)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Modifying Doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isModifying ? "Modify Doctor" : "Add Doctor"}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="doctorAddress"
                placeholder="Doctor Ethereum Address"
                value={newDoctor.doctorAddress}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={isModifying} // Disable when modifying
              />
              <input
                type="text"
                name="name"
                placeholder="Doctor Name"
                value={newDoctor.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={newDoctor.specialization}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newDoctor.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newDoctor.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                type="text"
                name="qualifications"
                placeholder="Qualifications (comma-separated)"
                value={newDoctor.qualifications}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsModifying(false);
                  }}
                  className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={isModifying ? handleModifyDoctor : handleAddDoctor}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {isModifying ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SideBarAdmin>
  );
}
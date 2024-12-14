"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Web3 from "web3";
import { useAuth } from "@/context/AuthContext";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function PatientRegistryPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // State to store patients' data and modal visibility
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientAddress: "",
    name: "",
    age: "",
    gender: "",
    email: "",
    phoneNumber: "",
  });

  // Fetch the list of patients
  useEffect(() => {
    const fetchPatients = async () => {
      if (!window.ethereum) {
        alert("Ethereum provider is not available. Please install MetaMask.");
        return;
      }
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);

      try {
        const patientAddresses = await contract.methods.getAllRegisteredPatients().call();
        const patientsData = await Promise.all(
          patientAddresses.map(async (address) => {
            const patientProfile = await contract.methods.getPatientProfile(address).call();
            return {
              address,
              ...patientProfile,
            };
          })
        );
        setPatients(patientsData);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  // Handle input changes for new patient
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({
      ...newPatient,
      [name]: value,
    });
  };

  // Add Patient
  const handleAddPatient = async () => {
    // Implementation unchanged
  };

  // Delete Patient
  const handleDeletePatient = async (patientAddress) => {
    if (!window.ethereum) {
      alert("Ethereum provider is not available. Please install MetaMask.");
      return;
    }
    const provider = new Web3(window.ethereum);
    const contract = new provider.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);
    try {
      const accounts = await provider.eth.getAccounts();
      await contract.methods.deletePatient(patientAddress).send({ from: accounts[0] });
      setPatients((prev) => prev.filter((patient) => patient.address !== patientAddress));
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient. Please try again.");
    }
  };

  // Modify Patient
  const handleModifyPatient = async (patient) => {
    // You can prefill the modal with patient details and allow editing
    setNewPatient({
      patientAddress: patient.address,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
    });
    setIsModalOpen(true);
  };

  return (
    <SideBarAdmin>
      <h1 className="text-3xl font-bold text-left text-black my-6">Patients Registry</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
      >
        Add Patient
      </button>

      {/* Patients Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Patient Address</th>
              <th className="px-6 py-3">Patient Name</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone Number</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">
                  {`${patient.address.slice(0, 4)}...${patient.address.slice(-4)}`}
                </td>
                <td className="px-6 py-4">{patient.name}</td>
                <td className="px-6 py-4">{patient.age}</td>
                <td className="px-6 py-4">{patient.gender}</td>
                <td className="px-6 py-4">{patient.email}</td>
                <td className="px-6 py-4">{patient.phoneNumber}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={handleModifyPatient}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2 hover:bg-yellow-600"
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Modifying Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{newPatient.patientAddress ? "Modify Patient" : "Add Patient"}</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="patientAddress"
                placeholder="Patient Ethereum Address"
                value={newPatient.patientAddress}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={!!newPatient.patientAddress} // Disable when modifying
              />
              {/* Other input fields */}
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
                  onClick={newPatient.patientAddress ? handleModifyPatient : handleAddPatient}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {newPatient.patientAddress ? "Update Patient" : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SideBarAdmin>
  );
}

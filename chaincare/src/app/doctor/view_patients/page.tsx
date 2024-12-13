"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Album } from 'lucide-react';
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarDoctor from "@/components/SideBarDoctor";
import { useRouter } from 'next/navigation';

// Centralize Web3 initialization logic
const initializeWeb3 = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    const web3 = new Web3(window.ethereum);
    return {
      web3,
      medicalRecordsContract: new web3.eth.Contract(ABI.MEDICAL_RECORDS_MANAGER, CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER),
      patientRegistryContract: new web3.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY)
    };
  }
  return null;
};

export default function DoctorDashboard() {
  const { logout } = useAuth();
  const [patientsWithAccessProfil, setPatientsWithAccessProfil] = useState<PatientAccessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorAddress, setDoctorAddress] = useState('');
  const router = useRouter();

  // Type definition for patient access profile
  interface PatientAccessProfile {
    patientProfile: {
      name: string;
      age: number;
      gender: string;
      email: string;
      phoneNumber: string;
      allergies: string[];
    };
    address: string;
  }

  // Fetch the doctor address
  const fetchDoctorAddress = async () => {
    try {
      const web3Instance = initializeWeb3();
      if (!web3Instance) throw new Error('Web3 not initialized');

      const accounts = await web3Instance.web3.eth.getAccounts();
      setDoctorAddress(accounts[0]);
    } catch (error) {
      console.error("Error fetching doctor address:", error);
    }
  };

  // Fetch the patients and check if each patient has granted access
  const fetchPatientsWithAccess = async () => {
    try {
      setLoading(true);
      const web3Instance = initializeWeb3();
      if (!web3Instance) throw new Error('Web3 not initialized');

      // Fetch all registered patients
      const patientAddresses = await web3Instance.patientRegistryContract.methods.getAllRegisteredPatients().call();

      // Check if the doctor has access to each patient's records
      const patientsWithAccessProfil = await Promise.all(
        patientAddresses.map(async (address: string) => {
          const patientProfile = await web3Instance.patientRegistryContract.methods.getPatientProfile(address).call();
          return { patientProfile, address };
        })
      );

      setPatientsWithAccessProfil(patientsWithAccessProfil);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients with access:", error);
      setLoading(false);
    }
  };

  // Fetch doctor address on component mount
  useEffect(() => {
    fetchDoctorAddress();
  }, []);

  // Fetch patients when doctor address is available
  useEffect(() => {
    if (doctorAddress) {
      fetchPatientsWithAccess();
    }
  }, [doctorAddress]);

  // Render loading state
  const renderLoadingState = () => (
    <tr>
      <td colSpan={8} className="text-center py-4">
        <div className="flex justify-center items-center">
          <svg
            className="w-6 h-6 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25"></circle>
            <path className="opacity-75" fill="none" d="M4 12a8 8 0 1 1 16 0A8 8 0 1 1 4 12z"></path>
          </svg>
          <span className="ml-2">Loading...</span>
        </div>
      </td>
    </tr>
  );

  // Render no patients found state
  const renderNoPatients = () => (
    <tr>
      <td colSpan={8} className="text-center py-4">No patients found.</td>
    </tr>
  );

  return (
    <SideBarDoctor>
      <div className="overflow-x-auto sm:rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 m-5 mb-5">
          Your Patients
        </h1>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Patient Address</th>
              <th scope="col" className="px-6 py-3">Patient Name</th>
              <th scope="col" className="px-6 py-3">Age</th>
              <th scope="col" className="px-6 py-3">Gender</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Phone Number</th>
              <th scope="col" className="px-6 py-3">Allergies</th>
              <th scope="col" className="px-6 py-3">Medical Records</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? renderLoadingState()
              : patientsWithAccessProfil.length === 0
                ? renderNoPatients()
                : patientsWithAccessProfil.map((patient, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">{patient.address}</td>
                      <td className="px-6 py-4">{patient.patientProfile.name}</td>
                      <td className="px-6 py-4">{patient.patientProfile.age.toString()}</td>
                      <td className="px-6 py-4">{patient.patientProfile.gender}</td>
                      <td className="px-6 py-4">{patient.patientProfile.email}</td>
                      <td className="px-6 py-4">{patient.patientProfile.phoneNumber}</td>
                      <td className="px-6 py-4">
                        {patient.patientProfile.allergies && patient.patientProfile.allergies.length > 0
                          ? patient.patientProfile.allergies.join(', ')
                          : 'No allergies'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`${patient.address}`)}
                          className="hover:bg-gray-100 rounded-full p-2 transition-colors"
                        >
                          <Album className="text-blue-500 hover:text-blue-700"/>
                        </button>
                      </td>
                    </tr>
                  )
                )
            }
          </tbody>
        </table>
      </div>
    </SideBarDoctor>
  );
}
// admin/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  ClipboardList, 
  Activity, 
  Calendar, 
  FileText 
} from 'lucide-react';
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard() {
  // State for statistics
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalMedicalRecords: 0,
    recentRegistrations: []
  });

  // Fetch statistics from contracts
  useEffect(() => {
    const fetchStatistics = async () => {
      if (!window.ethereum) {
        console.error("Ethereum provider not available");
        return;
      }

      const provider = new Web3(window.ethereum);
      
      try {
        // Patient Registry Contract
        const patientContract = new provider.eth.Contract(
          ABI.PATIENT_REGISTRY, 
          CONTRACT_ADDRESSES.PATIENT_REGISTRY
        );
        const patientAddresses = await patientContract.methods.getAllRegisteredPatients().call();

        // Doctor Registry Contract
        const doctorContract = new provider.eth.Contract(
          ABI.DOCTOR_REGISTRY, 
          CONTRACT_ADDRESSES.DOCTOR_REGISTRY
        );
        const doctorAddresses = await doctorContract.methods.getAllRegisteredDoctors().call();

        // Medical Records Contract
        const medicalRecordsContract = new provider.eth.Contract(
          ABI.MEDICAL_RECORDS_MANAGER, 
          CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER
        );

        // Prepare registration trend data
        const registrationData = [
          { name: 'Patients', count: patientAddresses.length },
          { name: 'Doctors', count: doctorAddresses.length }
        ];

        setStats({
          totalPatients: patientAddresses.length,
          totalDoctors: doctorAddresses.length,
          totalMedicalRecords: 0, // You might want to implement this method in your contract
          recentRegistrations: registrationData
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  // Sample data for charts (you can replace with actual contract data)
  const monthlyRegistrationData = [
    { name: 'Jan', Patients: 40, Doctors: 24 },
    { name: 'Feb', Patients: 30, Doctors: 13 },
    { name: 'Mar', Patients: 20, Doctors: 98 },
    { name: 'Apr', Patients: 27, Doctors: 39 },
    { name: 'May', Patients: 18, Doctors: 48 },
    { name: 'Jun', Patients: 23, Doctors: 38 }
  ];

  return (
    <SideBarAdmin>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Patients Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm uppercase">Total Patients</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <Users className="text-blue-500" size={48} />
            </div>
          </div>

          {/* Total Doctors Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm uppercase">Total Doctors</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
              </div>
              <Stethoscope className="text-green-500" size={48} />
            </div>
          </div>

          {/* Medical Records Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm uppercase">Medical Records</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalMedicalRecords}</p>
              </div>
              <ClipboardList className="text-purple-500" size={48} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Registrations Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Registrations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRegistrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Patients" stroke="#8884d8" />
                <Line type="monotone" dataKey="Doctors" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Registrations</h3>
            <div className="space-y-4">
              {stats.recentRegistrations.map((reg, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {reg.name === 'Patients' ? 
                      <Users className="text-blue-500" /> : 
                      <Stethoscope className="text-green-500" />
                    }
                    <span className="font-medium">{reg.name}</span>
                  </div>
                  <span className="font-bold text-gray-700">{reg.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SideBarAdmin>
  );
}
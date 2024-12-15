'use client';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarAdmin from "@/components/SideBarAdmin";

export default function HistoryPage() {
    const [, setWeb3] = useState(null);
    const [, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setWeb3(web3Instance);
                    const accs = await web3Instance.eth.getAccounts();
                    setAccounts(accs);
                    await fetchComprehensiveTransactionHistory(web3Instance);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    console.error("User denied account access")
                }
            }
        };

        initWeb3();
    }, []);

    const fetchComprehensiveTransactionHistory = async (web3Instance) => {
      if (!web3Instance) return;
  
      const contracts = {
          medicalRecordsManager: new web3Instance.eth.Contract(ABI.MEDICAL_RECORDS_MANAGER, CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER),
          patientRegistry: new web3Instance.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY),
          doctorRegistry: new web3Instance.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY),
          accessControl: new web3Instance.eth.Contract(ABI.MEDICAL_ACCESS_CONTROL, CONTRACT_ADDRESSES.MEDICAL_ACCESS_CONTROL),
          auditTrail: new web3Instance.eth.Contract(ABI.AUDIT_TRAIL, CONTRACT_ADDRESSES.AUDIT_TRAIL),
          documentStorage: new web3Instance.eth.Contract(ABI.DOCUMENT_STORAGE, CONTRACT_ADDRESSES.DOCUMENT_STORAGE)
      };
  
      const allTransactions = [];
  
      // Fetch events from all relevant contracts
      const eventSources = [
          // Access Control Events
          {
              contract: contracts.accessControl,
              events: [
                  { name: 'AdminAdded', type: 'Add Admin', transform: (log) => `Admin Added: ${log.returnValues.name || 'Unknown'}` },
                  { name: 'AdminRemoved', type: 'Remove Admin', transform: (log) => `Admin Removed: ${log.returnValues.removedAdmin || 'Unknown'}` },
                  { name: 'AdminDetailsUpdated', type: 'Update Admin', transform: (log) => `Admin Updated: ${log.returnValues.name || 'Unknown'}` }
              ]
          },
          // Patient Registry Events
          {
            contract: contracts.patientRegistry,
            events: [
                { 
                    name: 'PatientRegistered', 
                    type: 'Add Patient', 
                    transform: (log) => {
                        return `Patient Registered: ${log.returnValues.name || 'Unknown'}, Age: ${log.returnValues.age || 'N/A'}`;
                    }
                },
                { 
                    name: 'PatientProfileUpdated', 
                    type: 'Update Patient', 
                    transform: (log) => `Patient Profile Updated: ${log.returnValues.name || 'Unknown'}` 
                },
                { 
                    name: 'PatientDeleted', 
                    type: 'Delete Patient', 
                    transform: (log) => `Patient Deleted: ${log.returnValues.name || 'Unknown'}` 
                }
            ]
        },
        // Doctor Registry Events (Updated with Delete event)
        {
            contract: contracts.doctorRegistry,
            events: [
                { 
                    name: 'DoctorRegistered', 
                    type: 'Add Doctor', 
                    transform: (log) => {
                        return `Doctor Registered: ${log.returnValues.name || 'Unknown'}, Specialization: ${log.returnValues.specialization || 'N/A'}`;
                    }
                },
                { 
                    name: 'DoctorProfileUpdated', 
                    type: 'Update Doctor', 
                    transform: (log) => `Doctor Profile Updated: ${log.returnValues.name || 'Unknown'}` 
                },
                { 
                    name: 'DoctorDeleted', 
                    type: 'Delete Doctor', 
                    transform: (log) => `Doctor Deleted: ${log.returnValues.name || 'Unknown'}` 
                }
            ]
        },
          // Doctor Registry Events
          {
            contract: contracts.doctorRegistry,
            events: [
                { 
                    name: 'DoctorRegistered', 
                    type: 'Add Doctor', 
                    transform: (log) => {
                        return `Doctor Registered: ${log.returnValues.name || 'Unknown'}, Specialization: ${log.returnValues.specialization || 'N/A'}`;
                    }
                },
                { 
                    name: 'DoctorProfileUpdated', 
                    type: 'Update Doctor', 
                    transform: (log) => `Doctor Profile Updated: ${log.returnValues.name || 'Unknown'}` 
                },
                { 
                    name: 'DoctorDeleted', 
                    type: 'Delete Doctor', 
                    transform: (log) => `Doctor Deleted: ${log.returnValues.name || 'Unknown'}` 
                }
            ]
        },
          // Medical Records Manager Events
          {
              contract: contracts.medicalRecordsManager,
              events: [
                  { name: 'DoctorAccessGranted', type: 'Grant Access', transform: (log) => `Doctor Access Granted: Patient ${log.returnValues.patient} to Doctor ${log.returnValues.doctor}` },
                  { name: 'DoctorAccessRevoked', type: 'Revoke Access', transform: (log) => `Doctor Access Revoked: Patient ${log.returnValues.patient} from Doctor ${log.returnValues.doctor}` },
                  { name: 'MedicalRecordAdded', type: 'Add Medical Record', transform: (log) => `Medical Record Added: Patient ${log.returnValues.patient}, Record Type: ${log.returnValues.recordType}` },
                  { name: 'MedicalRecordUpdated', type: 'Update Medical Record', transform: (log) => `Medical Record Updated: Record ID ${log.returnValues.recordId}` },
                  { name: 'MedicalRecordDeleted', type: 'Delete Medical Record', transform: (log) => `Medical Record Deleted: Record ID ${log.returnValues.recordId}` }
              ]
          },
          // Document Storage Events
          {
              contract: contracts.documentStorage,
              events: [
                  { name: 'DocumentUploaded', type: 'Upload Document', transform: (log) => `Document Uploaded: Patient ${log.returnValues.patientAddress}, Doctor ${log.returnValues.doctorAddress}` }
              ]
          }
      ];
  
      // Fetch and process events from all sources
      for (const source of eventSources) {
          for (const eventConfig of source.events) {
              try {
                  const logs = await source.contract.getPastEvents(eventConfig.name, { fromBlock: 0 });
                  
                  console.log(`Logs for ${eventConfig.name}:`, logs);
                  
                  logs.forEach(log => {
                      // Add a fallback for timestamp if not present
                      const eventTimestamp = log.returnValues.timestamp 
                          ? log.returnValues.timestamp * 1000 
                          : log.blockTimestamp 
                          ? log.blockTimestamp * 1000 
                          : Date.now();
  
                      allTransactions.push({
                          type: eventConfig.type,
                          details: eventConfig.transform(log),
                          date: new Date(eventTimestamp).toLocaleString()
                      });
                  });
              } catch (error) {
                  console.error(`Error fetching ${eventConfig.name} events:`, error);
              }
          }
      }
  
      // Sort transactions by date in descending order
      setTransactions(allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

    return (
        <SideBarAdmin>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Comprehensive Transaction History</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left font-semibold">Transaction Type</th>
                                <th className="py-3 px-4 border-b text-left font-semibold">Details</th>
                                <th className="py-3 px-4 border-b text-left font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{transaction.type}</td>
                                    <td className="py-2 px-4 border-b">{transaction.details}</td>
                                    <td className="py-2 px-4 border-b">{transaction.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SideBarAdmin>
    );
}
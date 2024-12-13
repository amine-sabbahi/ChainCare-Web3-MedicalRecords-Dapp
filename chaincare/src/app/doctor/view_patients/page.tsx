"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, Container, Grid, Card, Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';

import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";

let web3;
let contract;

if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
  contract = new web3.eth.Contract(ABI.MEDICAL_RECORDS_MANAGER, CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER);
}

export default function DoctorDashboard() {
    const { logout } = useAuth();
    const [patientsWithAccess, setPatientsWithAccess] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctorAddress, setDoctorAddress] = useState('');
  
    // Fetch the doctor address
    const fetchDoctorAddress = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setDoctorAddress(accounts[0]);
      } catch (error) {
        console.error("Error fetching doctor address:", error);
      }
    };
  
    // Fetch the patients and check if each patient has granted access
    const fetchPatientsWithAccess = async () => {
      try {
        const provider = new Web3(window.ethereum);
        const contract_patient = new provider.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);
  
        // Fetch all registered patients
        const patientAddresses = await contract_patient.methods.getAllRegisteredPatients().call();
  
        // Check if the doctor has access to each patient's records
        const patientsWithAccessStatus = await Promise.all(patientAddresses.map(async (address) => {
          const hasAccess = await contract.methods.checkDoctorAccess(address, doctorAddress).call();
          return { address, hasAccess };
        }));
  
        console.log("Patients with access:", patientsWithAccessStatus);
        setPatientsWithAccess(patientsWithAccessStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patients with access:", error);
        setLoading(false);
      }
    };
  
    // Called when the component mounts
    useEffect(() => {
      fetchDoctorAddress();
    }, []);
  
    useEffect(() => {
      if (doctorAddress) {
        fetchPatientsWithAccess(); // Fetch patients once the doctor address is known
      }
    }, [doctorAddress]);


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Poppins", sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#FAF3F3',
          padding: '30px',
          borderRight: '1px solid #E0E0E0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          borderRadius: '10px',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 4, fontWeight: '600', color: '#89CFF0', letterSpacing: '1px' }}
        >
          Doctor Dashboard
        </Typography>
        <List>
          {[{ text: 'Dashboard' }, { text: 'Patients with Access' }].map(({ text }) => (
            <ListItem button key={text} sx={{ mb: 2, borderRadius: '8px', '&:hover': { backgroundColor: '#F0F8FF' } }}>
              <ListItemText primary={text} sx={{ fontWeight: '500', color: '#555' }} />
            </ListItem>
          ))}
        </List>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#F9F9F9' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#89CFF0',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: '600', letterSpacing: '1px' }}>
            Doctor Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={logout}
            sx={{
              borderRadius: '50px',
              padding: '6px 16px',
              borderColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: '#89CFF0',
              },
            }}
          >getPatientsWithAccess
            <ExitToApp sx={{ mr: 1 }} /> Logout
          </Button>
        </header>

        <Container sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{ mb: 4, fontWeight: '600', color: '#333', letterSpacing: '0.5px' }}
          >
            Patients Who Granted Access
          </Typography>
          <Card
            sx={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E0E0E0',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#89CFF0', fontWeight: '600' }}>
              Patients with Access to Your Data
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {patientsWithAccess.length > 0 ? (
                  patientsWithAccess.map((entry, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Patient Address: ${entry.address}`}
                        secondary={entry.hasAccess ? "Access Granted" : "Access Denied"}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>
                    No patients have granted you access.
                  </Typography>
                )}
              </List>
            )}
          </Card>
        </Container>
      </main>
    </div>
  );
}
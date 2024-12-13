"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, Container, Grid, Card, Typography, Box, List, ListItem, ListItemText, Switch } from '@mui/material';
import { Person, ExitToApp, History, MedicalServices, Security } from '@mui/icons-material';
import Sidebar from '@/components/sideBarPatient';

import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";

let web3;
let contract;

if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
  contract = new web3.eth.Contract(ABI.MEDICAL_RECORDS_MANAGER, CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER);
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true); // Assuming you have a loading state
      const provider = new Web3(window.ethereum);
  
      // Initialize contracts
      const doctorContract = new provider.eth.Contract(
        ABI.DOCTOR_REGISTRY,
        CONTRACT_ADDRESSES.DOCTOR_REGISTRY
      );
  
      // Fetch all registered doctor addresses
      const doctorAddresses = await doctorContract.methods.getAllRegisteredDoctors().call();
      console.log(doctorAddresses)
      // Fetch profile for each doctor
      const doctorsData = await Promise.all(
        doctorAddresses.map(async (address) => {
          const doctorProfile = await doctorContract.methods.getDoctorProfile(address).call();
          return {
            address,
            ...doctorProfile,
          };
        })
      );
  
      setDoctors(doctorsData); // Update state with fetched data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setLoading(false);
    }
  };
  

  const grantDoctorAccess = async (doctorAddress) => {
    try {
      const accounts = await web3.eth.getAccounts(); // Get connected wallet address
      const fromAddress = accounts[0]; // Use the first account
  
      await contract.methods.grantDoctorAccess(doctorAddress).send({ from: fromAddress });
  
      console.log(`Access granted to doctor: ${doctorAddress}`);
    } catch (error) {
      console.error("Error granting access:", error);
    }
  };
  
  const revokeDoctorAccess = async (doctorAddress) => {
    try {
      const accounts = await web3.eth.getAccounts(); // Get connected wallet address
      const fromAddress = accounts[0]; // Use the first account
  
      await contract.methods.revokeDoctorAccess(doctorAddress).send({ from: fromAddress });
  
      console.log(`Access revoked from doctor: ${doctorAddress}`);
    } catch (error) {
      console.error("Error revoking access:", error);
    }
  };
  
  const handleTogglePermission = async (doctorId) => {
    const doctor = doctors.find((doc) => doc.address === doctorId);
    if (!doctor) return;
  
    const isGranted = permissionStatus[doctorId] || false;
  
    try {
      if (!isGranted) {
        // Grant access to the doctor
        await grantDoctorAccess(doctor.address);
      } else {
        // Revoke access from the doctor
        await revokeDoctorAccess(doctor.address);
      }
  
      // Update permission status
      setPermissionStatus((prevStatus) => {
        const newStatus = { ...prevStatus, [doctorId]: !prevStatus[doctorId] };
        console.log('Updated permissionStatus:', newStatus);
        return newStatus;
      });
  
      // Log the transaction
      const action = !isGranted ? "Permission Granted" : "Permission Revoked";
      const timestamp = new Date().toLocaleString();
  
      setTransactions((prevTransactions) => {
        const newTransaction = {
          id: prevTransactions.length + 1,
          doctorName: doctor.name, // Ensure 'doctor' object is available
          action,
          timestamp,
        };

      console.log("New transaction logged:", newTransaction); 
      return [...prevTransactions, newTransaction];
    });

  
    } catch (error) {
      console.error("Error toggling permission:", error);
      alert("Failed to toggle permission. Please try again.");
    }
  };


  
  

  const checkDoctorAccess = async (doctorAddress) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0];
  
      const isGranted = await contract.methods.checkDoctorAccess(fromAddress, doctorAddress).call();
      setPermissionStatus(prevState => {
        const updatedStatus = { ...prevState, [doctorAddress]: isGranted };
        console.log(`Access status for doctor ${doctorAddress}: ${isGranted}`); // Log permission status for each doctor
        return updatedStatus;
      });
    } catch (error) {
      console.error("Error checking doctor access:", error);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      doctors.forEach((doctor) => {
        checkDoctorAccess(doctor.address); // Check access status for each doctor
      });
    }
  }, [doctors]);

  useEffect(() => {
    fetchDoctors();
  }, []);


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Poppins", sans-serif', backgroundColor: '#f4f7fa' }}>
      {/* Sidebar */}
      <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar />
      </Grid>
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', backgroundColor: '#FAFAFA' }}>
        {/* Dashboard Content */}
        <Container sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontWeight: '700',
              color: '#333',
              letterSpacing: '0.5px',
              fontSize: '1.8rem',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Doctors List & Permissions
          </Typography>
          
          <Card
            sx={{
              padding: '50px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              maxWidth: '6000px',
              border: '1px solidrgb(46, 167, 207)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: '600' }}>
              Manage Doctor Permissions
            </Typography>
  
            {loading ? (
              <Typography variant="body1" sx={{ color: '#888', fontSize: '1rem', textAlign: 'center' }}>
                Loading doctor data...
              </Typography>
            ) : (
              <Grid container spacing={4}>
                {doctors.map((doctor) => (
                  <Grid item xs={12} sm={6} md={4} key={doctor.id}> {/* Add unique key */}
                    <Card
                      sx={{
                        padding: '20px',
                        backgroundColor: '#F9F9F9',
                        borderRadius: '12px',
                        border: '2px solid #E0E0E0',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#333', fontWeight: '500', fontSize: '1.1rem' }}>
                        {doctor.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: '400', fontSize: '0.95rem' }}>
                        {doctor.specialization}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: '400', fontSize: '0.95rem' }}>
                        {doctor.phoneNumber}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: '400', fontSize: '0.95rem' }}>
                        {doctor.email}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '15px',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: '#888', fontSize: '0.85rem' }}>
                          Permission
                        </Typography>
                        <Switch
                          checked={permissionStatus[doctor.address] || false}
                          onChange={() => handleTogglePermission(doctor.address)}
                          inputProps={{ 'aria-label': 'controlled' }}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#3F51B5',
                            },
                            '& .MuiSwitch-track': {
                              backgroundColor: '#E0E0E0',
                            },
                          }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Container>
      </main>
    </div>
  );
}  
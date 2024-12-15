"use client";

// src/app/patient/page.tsx
import '../globals.css';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, Container, Grid, Card, Typography, Box ,} from '@mui/material';
import { Person, Email, Phone, Wc, Cake ,ExitToApp } from '@mui/icons-material';
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarPatient from '@/components/sideBarPatient';

import Web3 from 'web3';


export default function Dashboard() {
  const { logout } = useAuth();
  const [patientInfo, setPatientInfo] = useState({
    patientAddress: '',
    name: '',
    age: '',
    gender: '',
    email: '',
    phoneNumber: ''
  });  // Store patient info
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  // Function to fetch patient info from contract
  const fetchPatientInfo = async () => {
    try {
      if (!window.ethereum) {
        alert("Ethereum provider is not available. Please install MetaMask.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const patientAddress = accounts[0]; // Current user address

      const info: any = await contract.methods.getPatientProfile(patientAddress).call();
      console.log("Fetched patient data:", info);
      
      if (info) {
        setPatientInfo({
          patientAddress: patientAddress,
          name: info.name || 'Unknown',
          age: info.age ? Number(info.age) : 'Not specified',
          gender: info.gender || 'Not specified',
          email: info.email || 'Not specified',
          phoneNumber: info.phoneNumber?.toString() || 'Not specified',
        });
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePatientInfo = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);
  
      // Request user's Ethereum accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const patientAddress = accounts[0]; // This is the patient's address
  
      // Update the patient information in the smart contract
      await contract.methods
        .updatePatientProfile(
          patientAddress, // Pass the patient's address
          patientInfo.name,
          patientInfo.age,
          patientInfo.email,
          patientInfo.phoneNumber
        )
        .send({ from: patientAddress });

      
      // Notify the user that the profile was updated successfully
      alert("Profile updated successfully!");
      setIsEditing(false); // Close the editing mode
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };
 

  // Fetch patient info on component mount
  useEffect(() => {
    fetchPatientInfo();
  }, []);



  // Log the updated patient info when it changes
  useEffect(() => {
    console.log("Updated patient info:", patientInfo);
  }, [patientInfo]); // This effect runs whenever patientInfo changes


  

  return (
    <SideBarPatient>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {loading ? (
          <Typography variant="h6" align="center" sx={{color: '#333'}}>
            Loading patient data...
          </Typography>
        ) : (
          <Card
            sx={{
              p: 14, // Increased padding for a larger card
              borderRadius: '20px', // Slightly rounded border for elegance
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', // Deeper shadow for better contrast
              backgroundColor: '#ffffff', // Light background
              width: '110%',
              maxWidth: '5000px', // Increased max-width for a bigger card
              border: '2px solid #333', // Stronger border with dark color
              fontFamily: '"Roboto", "Arial", sans-serif', // Classy and modern font family
            }}
          >
            <Typography variant="h5" align="center" sx={{fontWeight: '700', color: '#333', mb: 3}}>
              Patient Information
            </Typography>
            {!isEditing ? (
              <>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                  {[{label: 'Name', value: patientInfo.name, icon: <Person sx={{color: '#86c5d8'}}/>},
                    {label: 'Age', value: patientInfo.age, icon: <Cake sx={{color: '#fad6a5'}}/>},
                    {label: 'Gender', value: patientInfo.gender, icon: <Wc sx={{color: '#f5b6c4'}}/>},
                    {label: 'Email', value: patientInfo.email, icon: <Email sx={{color: '#a8d5e2'}}/>},
                    {label: 'Phone', value: patientInfo.phoneNumber, icon: <Phone sx={{color: '#e6f3ec'}}/>}]
                    .map(({label, value, icon}, index) => (
                      <Box key={index} sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        {icon}
                        <Typography variant="body1" sx={{color: '#333', fontWeight: '500'}}>
                          <strong>{label}:</strong> {value}
                        </Typography>
                      </Box>
                    ))}
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 3,
                    alignSelf: 'flex-start',
                    color: '#333',
                    borderColor: '#333',
                    '&:hover': {
                      backgroundColor: '#333',
                      borderColor: '#333',
                      color: '#ffffff',
                    },
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              <Box
                component="form"
                sx={{display: 'flex', flexDirection: 'column', gap: 3}}
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await updatePatientInfo();
                    setIsEditing(false);
                  } catch (error) {
                    console.error('Error updating patient info:', error);
                  }
                }}
              >
                <Typography variant="h6" align="center" sx={{mb: 3, fontWeight: '700', color: '#333'}}>
                  Edit Patient Information
                </Typography>
                {[{label: 'Name', value: patientInfo.name, icon: <Person sx={{color: '#86c5d8'}}/>},
                  {label: 'Age', value: patientInfo.age, icon: <Cake sx={{color: '#fad6a5'}}/>},
                  {label: 'Gender', value: patientInfo.gender, icon: <Wc sx={{color: '#f5b6c4'}}/>},
                  {label: 'Email', value: patientInfo.email, icon: <Email sx={{color: '#a8d5e2'}}/>},
                  {label: 'Phone', value: patientInfo.phoneNumber, icon: <Phone sx={{color: '#e6f3ec'}}/>}]
                  .map(({label, value, icon}, index) => (
                    <Box key={index} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      {icon}
                      <input
                        type={label === 'Age' ? 'number' : 'text'}
                        placeholder={label}
                        value={value}
                        onChange={(e) => setPatientInfo({...patientInfo, [label.toLowerCase()]: e.target.value})}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #ccc',
                          backgroundColor: '#f9f9f9',
                          fontFamily: '"Roboto", "Arial", sans-serif',
                        }}
                      />
                    </Box>
                  ))}
                <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2}}>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#a8d5e2',
                      ':hover': {backgroundColor: '#86c5d8'},
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </Card>
        )}
      </Container>
    </SideBarPatient>
  );
}
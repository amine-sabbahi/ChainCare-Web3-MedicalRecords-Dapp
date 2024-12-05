"use client";

// src/app/dashboard/page.tsx
import '../globals.css';
import { useState, useEffect } from 'react';
import { Button, Container, Grid, Card, Typography } from '@mui/material';
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import Web3 from 'web3';

export default function Dashboard() {
  const [patientInfo, setPatientInfo] = useState({
    patientAddress: '',
    name: '',
    age: '',
    gender: '',
    email: '',
    phoneNumber: ''
  });  // Store patient info
  const [loading, setLoading] = useState(true); // Handle loading state

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

  // Fetch patient info on component mount
  useEffect(() => {
    fetchPatientInfo();
  }, []);

  // Log the updated patient info when it changes
  useEffect(() => {
    console.log("Updated patient info:", patientInfo);
  }, [patientInfo]); // This effect runs whenever patientInfo changes

  return (
    <div className="bg-pastel-100 min-h-screen">
      <header className="bg-pastel-600 p-4 shadow-md">
        <Typography
          variant="h4"
          align="center"
          className="font-semibold"
          sx={{ color: '#a8d5e2' }} // Pastel color
        >
          Patient Dashboard
        </Typography>
      </header>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <section>
          {loading ? (
            <Typography variant="h6" align="center">
              Loading patient data...
            </Typography>
          ) : patientInfo ?  (
            <>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                className="text-pastel-800 font-bold"
              >
                Welcome, {patientInfo.name}
              </Typography>
              
              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                className="text-pastel-600"
              >
                Age: {patientInfo.age} | Gender: {patientInfo.gender} | Contact: {patientInfo.phoneNumber}

              </Typography>

            </>
          ) : (
            <Typography variant="h6" align="center">
              No patient data available.
            </Typography>
          )}
        </section>

        <section>
          <Typography
            variant="h6"
            sx={{ mt: 6 }}
            className="text-pastel-800 font-semibold"
          >
            Quick Actions
          </Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            {/* Card for medical records */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fdf4e3',
                }}
              >
                <Typography variant="h6" className="text-pastel-800">
                  My Medical Records
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View and download your medical records.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#a8d5e2',
                    ':hover': { backgroundColor: '#86c5d8' },
                  }}
                  href="/patient/records"
                >
                  View
                </Button>
              </Card>
            </Grid>
            {/* Card for managing permissions */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#e6f3ec',
                }}
              >
                <Typography variant="h6" className="text-pastel-800">
                  Manage Permissions
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Grant or revoke access to your records.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#f5b6c4',
                    ':hover': { backgroundColor: '#e298a5' },
                  }}
                  href="/dashboard/permissions"
                >
                  Manage
                </Button>
              </Card>
            </Grid>
            {/* Card for action history */}
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fcefee',
                }}
              >
                <Typography variant="h6" className="text-pastel-800">
                  History
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Check your action history on medical records.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#fad6a5',
                    ':hover': { backgroundColor: '#f7c68a' },
                  }}
                  href="/dashboard/audit"
                >
                  View History
                </Button>
              </Card>
            </Grid>
          </Grid>
        </section>
      </Container>

      <footer className="bg-pastel-700 text-purple p-4 mt-6 text-center shadow-md">
        <p>&copy; 2024 Medical Records with Blockchain</p>
      </footer>
    </div>
  );
}

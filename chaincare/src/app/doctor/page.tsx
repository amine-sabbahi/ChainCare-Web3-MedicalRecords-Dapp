"use client";

// src/app/doctor/page.tsx
import '../globals.css';
import { useState, useEffect } from 'react';
import { Button, Container, Grid, Card, Typography } from '@mui/material';
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import Web3 from 'web3';

export default function DoctorDashboard() {
  const [doctorInfo, setDoctorInfo] = useState({
    doctorAddress: '',
    name: '',
    specialization: '',
    email: '',
    phoneNumber: '',
  }); // Store doctor info
  const [loading, setLoading] = useState(true); // Handle loading state

  // Function to fetch doctor info from contract
  const fetchDoctorInfo = async () => {
    try {
      if (!window.ethereum) {
        alert("Ethereum provider is not available. Please install MetaMask.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const doctorAddress = accounts[0]; // Current user address

      const info: any = await contract.methods.getDoctorProfile(doctorAddress).call();
      console.log("Fetched doctor data:", info);
      
      if (info) {
        setDoctorInfo({
          doctorAddress: doctorAddress,
          name: info.name || 'Unknown',
          specialization: info.specialization || 'Not specified',
          email: info.email || 'Not specified',
          phoneNumber: info.phoneNumber || 'Not specified',
        });
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor info on component mount
  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  // Log the updated doctor info when it changes
  useEffect(() => {
    console.log("Updated doctor info:", doctorInfo);
  }, [doctorInfo]);

  return (
    <div className="bg-pastel-100 min-h-screen">
      <header className="bg-pastel-600 p-4 shadow-md">
        <Typography
          variant="h4"
          align="center"
          className="font-semibold"
          sx={{ color: '#a8d5e2' }} // Pastel color
        >
          Doctor Dashboard
        </Typography>
      </header>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <section>
          {loading ? (
            <Typography variant="h6" align="center">
              Loading doctor data...
            </Typography>
          ) : doctorInfo ? (
            <>
              <Typography
                variant="h5"
                gutterBottom
                align="center"
                className="text-pastel-800 font-bold"
              >
                Welcome, Dr. {doctorInfo.name}
              </Typography>

              <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                className="text-pastel-600"
              >
                Specialization: {doctorInfo.specialization} | Contact: {doctorInfo.phoneNumber}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" align="center">
              No doctor data available.
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
            {/* Card for viewing patients */}
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
                  View Patients
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View a list of all registered patients.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#a8d5e2',
                    ':hover': { backgroundColor: '#86c5d8' },
                  }}
                  href="/doctor/view_patients"
                >
                  View Patients
                </Button>
              </Card>
            </Grid>
            {/* Card for managing access to medical records */}
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
                  Manage Patient Access
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Grant or revoke access to patient records.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#f5b6c4',
                    ':hover': { backgroundColor: '#e298a5' },
                  }}
                  href="/doctor/manage-access"
                >
                  Manage Access
                </Button>
              </Card>
            </Grid>
            {/* Card for adding or updating medical records */}
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
                  Add Medical Record
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Add or update medical records for your patients.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#fad6a5',
                    ':hover': { backgroundColor: '#f7c68a' },
                  }}
                  href="/doctor/add-record"
                >
                  Add Record
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

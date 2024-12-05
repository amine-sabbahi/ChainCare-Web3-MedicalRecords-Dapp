"use client";

// src/app/dashboard/page.tsx
import '../globals.css';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button, Container, Grid, Card, Typography, Box ,} from '@mui/material';
import { Person, Email, Phone, Wc, Cake ,ExitToApp } from '@mui/icons-material';
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
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
        <Button
          variant="outlined"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
          onClick={logout}  // Logout action
        >
          <ExitToApp sx={{ mr: 1 }} /> Logout
        </Button>
      </header>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Container maxWidth="md" sx={{ mt: 6 }}>
      <section>
  {loading ? (
    <Typography variant="h6" align="center">
      Loading patient data...
    </Typography>
  ) : (
    <Card
      sx={{
        p: 4,
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <Typography variant="h5" align="center" className="font-bold" sx={{ mb: 2 }}>
        Patient Information
      </Typography>
      {!isEditing ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person sx={{ color: '#86c5d8' }} />
              <Typography variant="body1">
                <strong>Name:</strong> {patientInfo.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Cake sx={{ color: '#fad6a5' }} />
              <Typography variant="body1">
                <strong>Age:</strong> {patientInfo.age}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Wc sx={{ color: '#f5b6c4' }} />
              <Typography variant="body1">
                <strong>Gender:</strong> {patientInfo.gender}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ color: '#a8d5e2' }} />
              <Typography variant="body1">
                <strong>Email:</strong> {patientInfo.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: '#e6f3ec' }} />
              <Typography variant="body1">
                <strong>Phone:</strong> {patientInfo.phoneNumber}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </>
      ) : (
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await updatePatientInfo(patientInfo); // Update info on blockchain
              setIsEditing(false); // Close edit mode after successful save
            } catch (error) {
              console.error('Error updating patient info:', error);
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ color: '#86c5d8' }} />
            <input
              type="text"
              placeholder="Name"
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Cake sx={{ color: '#fad6a5' }} />
            <input
              type="number"
              placeholder="Age"
              value={patientInfo.age}
              onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Wc sx={{ color: '#f5b6c4' }} />
            <select
              value={patientInfo.gender}
              onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email sx={{ color: '#a8d5e2' }} />
            <input
              type="email"
              placeholder="Email"
              value={patientInfo.email}
              onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone sx={{ color: '#e6f3ec' }} />
            <input
              type="text"
              placeholder="Phone"
              value={patientInfo.phoneNumber}
              onChange={(e) => setPatientInfo({ ...patientInfo, phoneNumber: e.target.value })}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#a8d5e2',
                ':hover': { backgroundColor: '#86c5d8' },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  )}
</section>

      </Container>

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
                  href="/patient/ManagePermissions"
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

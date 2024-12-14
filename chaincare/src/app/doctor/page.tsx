"use client";

import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Box,
  Paper,
  Chip, Container
} from '@mui/material';
import {
  MedicalServices as MedicalServicesIcon,
  Article as ArticleIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import Web3 from 'web3';
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import SideBarDoctor from "@/components/SideBarDoctor";

// Interfaces for type safety
interface DoctorInfo {
  doctorAddress: string;
  name: string;
  specialization: string;
  email: string;
  phoneNumber: string;
}

interface PatientDocument {
  doctorAddress: string;
  patientAddress: string;
  fileLinks: string[];
  timestamp: number;
}

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

export default function DoctorDashboard() {
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo>({
    doctorAddress: '',
    name: 'Unknown',
    specialization: 'Not specified',
    email: 'Not specified',
    phoneNumber: 'Not specified'
  });
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientAccessProfile[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<PatientDocument[]>([]);

  // Initialize Web3 and contracts
  const initializeWeb3 = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3 = new Web3(window.ethereum);
      return {
        web3,
        doctorRegistryContract: new web3.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY),
        patientRegistryContract: new web3.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY),
        documentStorageContract: new web3.eth.Contract(ABI.DOCUMENT_STORAGE, CONTRACT_ADDRESSES.DOCUMENT_STORAGE)
      };
    }
    return null;
  };

  // Fetch doctor info from contract
  const fetchDoctorInfo = async () => {
    try {
      const web3Instance = initializeWeb3();
      if (!web3Instance) throw new Error('Web3 not initialized');

      const accounts = await web3Instance.web3.eth.getAccounts();
      const doctorAddress = accounts[0];

      const info = await web3Instance.doctorRegistryContract.methods.getDoctorProfile(doctorAddress).call();

      setDoctorInfo({
        doctorAddress,
        name: info.name || 'Unknown',
        specialization: info.specialization || 'Not specified',
        email: info.email || 'Not specified',
        phoneNumber: info.phoneNumber || 'Not specified'
      });
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  // Fetch patients for the doctor
  const fetchPatients = async () => {
    try {
      const web3Instance = initializeWeb3();
      if (!web3Instance) throw new Error('Web3 not initialized');

      const patientAddresses = await web3Instance.patientRegistryContract.methods.getAllRegisteredPatients().call();

      const patientsWithProfiles = await Promise.all(
        patientAddresses.map(async (address: string) => {
          const patientProfile = await web3Instance.patientRegistryContract.methods.getPatientProfile(address).call();
          return { patientProfile, address };
        })
      );

      setPatients(patientsWithProfiles);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch recent documents across all patients
  const fetchRecentDocuments = async () => {
    try {
      const web3Instance = initializeWeb3();
      if (!web3Instance) throw new Error('Web3 not initialized');

      const patientAddresses = await web3Instance.patientRegistryContract.methods.getAllRegisteredPatients().call();

      const allDocuments: PatientDocument[] = [];

      for (const address of patientAddresses) {
        const patientDocs = await web3Instance.documentStorageContract.methods.getDocuments(address).call();
        allDocuments.push(...patientDocs);
      }

      // Sort documents by timestamp, most recent first
      const sortedDocuments = allDocuments.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

      // Take top 5 most recent documents
      setRecentDocuments(sortedDocuments.slice(0, 5));
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchDoctorInfo();
      await fetchPatients();
      await fetchRecentDocuments();
      setLoading(false);
    };

    fetchAllData();
  }, []);

  // Render dashboard sections
  const renderSummarySection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountCircleIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Typography variant="h6">Doctor Profile</Typography>
            </Box>
            <Typography variant="body1">
              Name: {doctorInfo.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Specialization: {doctorInfo.specialization}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <MedicalServicesIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Typography variant="h6">Patient Statistics</Typography>
            </Box>
            <Typography variant="body1">
              Total Patients: {patients.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <ArticleIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Typography variant="h6">Recent Documents</Typography>
            </Box>
            <Typography variant="body1">
              Total Documents: {recentDocuments.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRecentDocuments = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Patient Documents
        </Typography>
        {recentDocuments.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No recent documents
          </Typography>
        ) : (
          recentDocuments.map((doc, index) => (
            <Box key={index} mb={2}>
              <Typography variant="body2">
                Patient: {doc.patientAddress}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Uploaded: {new Date(Number(doc.timestamp) * 1000).toLocaleString()}
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                {doc.fileLinks.map((link, linkIndex) => (
                  <Chip
                    key={linkIndex}
                    label={`File ${linkIndex + 1}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );

  return (
    <SideBarDoctor>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Doctor Dashboard
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {renderSummarySection()}
            {renderRecentDocuments()}
          </>
        )}
      </Container>
    </SideBarDoctor>
  );
}
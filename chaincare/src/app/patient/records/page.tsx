"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Card, Button, CircularProgress } from "@mui/material";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import Web3 from "web3";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch medical records from smart contract
  const fetchMedicalRecords = async () => {
    try {
      if (!window.ethereum) {
        alert("Ethereum provider is not available. Please install MetaMask.");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ABI.MEDICAL_RECORDS, CONTRACT_ADDRESSES.MEDICAL_RECORDS);

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const patientAddress = accounts[0]; // User's wallet address

      const records = await contract.methods.getPatientRecords(patientAddress).call();
      console.log("Fetched medical records:", records);
      setRecords(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download records as a JSON file
  const downloadRecords = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "medical_records.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Fetch records on component mount
  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  return (
    <div className="bg-pastel-100 min-h-screen">
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          My Medical Records
        </Typography>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
            <Typography variant="body1">Fetching your records...</Typography>
          </div>
        ) : records.length > 0 ? (
          <div>
            {records.map((record: any, index: number) => (
              <Card
                key={index}
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: "16px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="h6">Record {index + 1}</Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {record.date}
                </Typography>
                <Typography variant="body2">
                  <strong>Diagnosis:</strong> {record.diagnosis}
                </Typography>
                <Typography variant="body2">
                  <strong>Prescriptions:</strong> {record.prescriptions.join(", ")}
                </Typography>
                <Typography variant="body2">
                  <strong>Doctor:</strong> {record.doctor}
                </Typography>
              </Card>
            ))}
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#a8d5e2", ":hover": { backgroundColor: "#86c5d8" } }}
              onClick={downloadRecords}
            >
              Download Records
            </Button>
          </div>
        ) : (
          <Typography variant="h6" align="center">
            No medical records found.
          </Typography>
        )}
      </Container>
    </div>
  );
}

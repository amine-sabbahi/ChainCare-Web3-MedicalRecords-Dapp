"use client";
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useAuth } from '@/context/AuthContext';
import { Button, Container, Grid, Card, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Sidebar from '@/components/sideBarPatient';
import { ABI, CONTRACT_ADDRESSES } from '@/components/contracts';

let web3;
let contract;

if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
  contract = new web3.eth.Contract(ABI.MEDICAL_RECORDS_MANAGER, CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER);
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true); // Assuming you have a loading state

      const provider = new Web3(window.ethereum);

      // Initialize the contract for doctor registry
      const doctorContract = new provider.eth.Contract(ABI.DOCTOR_REGISTRY, CONTRACT_ADDRESSES.DOCTOR_REGISTRY);

      // Fetch all registered doctor addresses (Optional: depending on your contract structure)
      const doctorAddresses = await doctorContract.methods.getAllDoctors().call();
      console.log(doctorAddresses);

    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  }

  const listenForTransactionEvents = async () => {
    try {
      // Initialize web3 with the Ethereum provider
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);
      
  
      // Listen for the "PatientProfileUpdated" events
      contract.events.PatientProfileUpdated({ fromBlock: 'latest' })
        .on('data', async (event) => {
          try {
            console.log("Received event", event);
  
            // Extract data from the event
            const { patientAddress, name } = event.returnValues;
            const transactionHash = event.transactionHash;
  
            console.log("Transaction Hash", transactionHash);
  
            // Fetch transaction and receipt details
            const transactionDetails = await provider.eth.getTransaction(transactionHash);
            const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
  
            // Fetch block details for timestamp
            const blockDetails = await provider.eth.getBlock(event.blockNumber);
            const blockTimestamp = blockDetails.timestamp; // in seconds

            const timestampInSeconds = Number(blockTimestamp);

            // Convert seconds to milliseconds
            const timestampInMilliseconds = timestampInSeconds * 1000;

            // Create a Date object
            const readableDate = new Date(timestampInMilliseconds);

            // Format the date to a human-readable format
            console.log("Readable Date:", readableDate.toLocaleString());
  
            // Format the transaction data
            const newTransaction = {
                type: "Profile Updated", 
              patientAddress,
              name,
              transactionHash,
              value: transactionDetails.value, // Amount transferred (if any)
              gasUsed: transactionReceipt.gasUsed, // Gas used
              status: transactionReceipt.status ? "Success" : "Failed", // Transaction status
              timestamp: readableDate  // Convert timestamp to readable format
            };
  
            console.log("New Transaction", newTransaction);
  
            // Update the transaction state
            setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
          } catch (error) {
            console.error("Error processing the event data:", error);
          }
        });
    } catch (error) {
      console.error("Failed to initialize event listener:", error);
    }
  };

  const listenForTransactionAccess = async () => {
    try {
      // Initialize web3 with the Ethereum provider
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(ABI.MEDICAL_RECORDS_MANAGER, CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER);
  
      // Listen for the "DoctorAccessGranted" events
      contract.events.DoctorAccessGranted({ fromBlock: 'latest' })
        .on('data', async (event) => {
          try {
            console.log("Received DoctorAccessGranted event", event.returnValues);
            
            // Extract data from the event
            const { patient, doctor } = event.returnValues;
            const transactionHash = event.transactionHash;
            console.log("Transaction Hash for Granting Access", transactionHash);
  
            // Fetch transaction and receipt details
            const transactionDetails = await provider.eth.getTransaction(transactionHash);
            const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
            
            // Fetch block details for timestamp
            const blockDetails = await provider.eth.getBlock(event.blockNumber);
            const blockTimestamp = blockDetails.timestamp;
            
            // Convert block timestamp to milliseconds
            const readableDate = new Date(Number(blockTimestamp) * 1000);
            console.log("Readable Date for Access Granted:", readableDate.toLocaleString());
  
            // Prepare the transaction data
            const newTransaction = {
              type: "Access Granted",
              patient,
              doctor,
              transactionHash,
              value: transactionDetails.value,
              gasUsed: transactionReceipt.gasUsed,
              status: transactionReceipt.status ? "Success" : "Failed",
              timestamp: readableDate
            };
            
            console.log("New Transaction for Access Granted", newTransaction);
            setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
          } catch (error) {
            console.error("Error processing the Grant Access event data:", error);
          }
        });
  
      // Listen for the "DoctorAccessRevoked" events
      contract.events.DoctorAccessRevoked({ fromBlock: 'latest' })
        .on('data', async (event) => {
          try {
            console.log("Received DoctorAccessRevoked event", event.returnValues);
  
            // Extract data from the event
            const { patient, doctor } = event.returnValues;
            const transactionHash = event.transactionHash;
            console.log("Transaction Hash for Revoking Access", transactionHash);
  
            // Fetch transaction and receipt details
            const transactionDetails = await provider.eth.getTransaction(transactionHash);
            const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
            
            // Fetch block details for timestamp
            const blockDetails = await provider.eth.getBlock(event.blockNumber);
            const blockTimestamp = blockDetails.timestamp;
            
            // Convert block timestamp to milliseconds
            const readableDate = new Date(Number(blockTimestamp) * 1000);
            console.log("Readable Date for Access Revoked:", readableDate.toLocaleString());
  
            // Prepare the transaction data
            const newTransaction = {
              type: "Access Revoked",
              patient,
              doctor,
              transactionHash,
              value: transactionDetails.value,
              gasUsed: transactionReceipt.gasUsed,
              status: transactionReceipt.status ? "Success" : "Failed",
              timestamp: readableDate
            };
            
            console.log("New Transaction for Access Revoked", newTransaction);
            setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
          } catch (error) {
            console.error("Error processing the Revoke Access event data:", error);
          }
        });
  
    } catch (error) {
      console.error("Failed to initialize event listener:", error);
    }
  };
  

  const fetchHistoricalEvents = async () => {
    try {
      console.log("hi");
  
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(ABI.PATIENT_REGISTRY, CONTRACT_ADDRESSES.PATIENT_REGISTRY);
  
      // Fetch all the "PatientProfileUpdated" events from the contract (historical events)
      const events = await contract.getPastEvents("PatientProfileUpdated", {
        fromBlock: 0,  // Starts from the first block (you can set a different block number if needed)
        toBlock: 'latest'  // Ensures that we get up to the latest block
      });
  
      console.log(events);
  
      // Using for..of to handle async calls in a loop
      for (let event of events) {
        const { patientAddress, name } = event.returnValues;
        const transactionHash = event.transactionHash;
  
        // Fetch block details for timestamp
        const blockDetails = await provider.eth.getBlock(event.blockNumber);
        const blockTimestamp = blockDetails.timestamp; // in seconds
  
        const timestampInSeconds = Number(blockTimestamp);
        // Convert seconds to milliseconds
        const timestampInMilliseconds = timestampInSeconds * 1000;
        // Create a Date object
        const readableDate = new Date(timestampInMilliseconds);
  
        // Fetch additional data from transaction
        const transactionDetails = await provider.eth.getTransaction(transactionHash);
        const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
  
        // Creating a new transaction object with the details
        const newTransaction = {
          type: "Profile Updated",
          patientAddress,
          name,
          transactionHash,
          value: transactionDetails.value,
          gasUsed: transactionReceipt.gasUsed,
          status: transactionReceipt.status ? "Success" : "Failed",
          timestamp: readableDate
        };
  
        // Update the transactions state
        setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      }
    } catch (error) {
      console.error("Error fetching historical events:", error);
    }
  };

  const fetchHistoricalAccess = async () => {
    try {
      console.log("hi");
  
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(ABI.MEDICAL_RECORDS_MANAGER, CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER);
  
      // Fetch historical events for "DoctorAccessGranted"
      const grantEvents = await contract.getPastEvents("DoctorAccessGranted", {
        fromBlock: 0,  // Starts from the first block (you can set a different block number if needed)
        toBlock: 'latest'  // Ensures that we get up to the latest block
      });
  
      console.log("Grant Events: ", grantEvents);
  
      // Process the "Access Granted" events
      for (let event of grantEvents) {
        const { patient, doctor } = event.returnValues;
        const transactionHash = event.transactionHash;
  
        // Fetch block details for timestamp
        const blockDetails = await provider.eth.getBlock(event.blockNumber);
        const blockTimestamp = blockDetails.timestamp; // in seconds
  
        const timestampInSeconds = Number(blockTimestamp);
        // Convert seconds to milliseconds
        const timestampInMilliseconds = timestampInSeconds * 1000;
        const readableDate = new Date(timestampInMilliseconds);
  
        // Fetch transaction and receipt details
        const transactionDetails = await provider.eth.getTransaction(transactionHash);
        const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
  
        const newTransaction = {
          type: "Access Granted",
          patient,
          doctor,
          transactionHash,
          value: transactionDetails.value,
          gasUsed: transactionReceipt.gasUsed,
          status: transactionReceipt.status ? "Success" : "Failed",
          timestamp: readableDate
        };
  
        // Update state with the new transaction data
        setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      }
  
      // Fetch historical events for "DoctorAccessRevoked"
      const revokeEvents = await contract.getPastEvents("DoctorAccessRevoked", {
        fromBlock: 0,
        toBlock: 'latest'
      });
  
      console.log("Revoke Events: ", revokeEvents);
  
      // Process the "Access Revoked" events
      for (let event of revokeEvents) {
        const { patient, doctor } = event.returnValues;
        const transactionHash = event.transactionHash;
  
        // Fetch block details for timestamp
        const blockDetails = await provider.eth.getBlock(event.blockNumber);
        const blockTimestamp = blockDetails.timestamp; // in seconds
  
        const timestampInSeconds = Number(blockTimestamp);
        // Convert seconds to milliseconds
        const timestampInMilliseconds = timestampInSeconds * 1000;
        const readableDate = new Date(timestampInMilliseconds);
  
        // Fetch transaction and receipt details
        const transactionDetails = await provider.eth.getTransaction(transactionHash);
        const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
  
        const newTransaction = {
          type: "Access Revoked",
          patient,
          doctor,
          transactionHash,
          value: transactionDetails.value,
          gasUsed: transactionReceipt.gasUsed,
          status: transactionReceipt.status ? "Success" : "Failed",
          timestamp: readableDate
        };
  
        // Update state with the new transaction data for revoked access
        setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      }
    } catch (error) {
      console.error("Error fetching historical events:", error);
    }
  };
  
  
  
  
  

  // Call the function when the component mounts
  useEffect(() => {
    listenForTransactionEvents(); // Start listening for events
    listenForTransactionAccess();
    fetchHistoricalEvents();
    fetchHistoricalAccess();
  }, []);

  return (
    <Container maxWidth="xl"> {/* Increased container width */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}> {/* Reduced sidebar width */}
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={9}> {/* Increased main content width */}
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: 'bold', 
              color: 'primary.main', 
              textAlign: 'center', 
              padding: '10px',
            }}
          >
            Transaction History
          </Typography>  
          {/* Transactions Table */}
          <Box mt={2} justifyContent="center">
            <TableContainer 
              component={Card} 
              sx={{ 
                width: '100%', 
                maxHeight: '900px', // Added max height
                overflow: 'auto',
                border: '1px solid rgba(224, 224, 224, 1)',    // Added scrolling if content exceeds height
              }}
            >
              <Table 
                sx={{ 
                  minWidth: 800,  // Ensure minimum width
                  width: '100%'   // Full width of container
                }} 
                aria-label="transaction table"
              >
                <TableHead 
                  sx={{ 
                    position: 'sticky', 
                    top: 0, 
                    backgroundColor: 'background.default', 
                    zIndex: 1 
                  }}
                >
                  <TableRow>
                    <TableCell>Transaction Type</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        {transaction.type === "Profile Updated" 
                          ? `${transaction.name} profile updated` 
                          : transaction.type === "Access Granted"
                            ? `${transaction.patient} granted access to ${transaction.doctor}`
                            : transaction.type === "Access Revoked"
                            ? `${transaction.patient} revoked access from ${transaction.doctor}`
                            : ""}
                      </TableCell>
                      <TableCell>{transaction.status}</TableCell>
                      <TableCell>{transaction.timestamp.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}  

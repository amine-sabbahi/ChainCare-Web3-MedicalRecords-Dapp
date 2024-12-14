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

  

  const listenForDocuments = async () => {
    try {
      // Initialize web3 with the Ethereum provider
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(
        ABI.DOCUMENT_STORAGE, 
        CONTRACT_ADDRESSES.DOCUMENT_STORAGE
      );
  
      // Listen to the DocumentUploaded event
      contract.events.DocumentUploaded({ fromBlock: 'latest' })
        .on('data', async (event) => {
          try {
            console.log("Received event doc:", event);
  
            // Extract event data
            const { doctorAddress, patientAddress, fileLinks, timestamp } = event.returnValues;
            const transactionHash = event.transactionHash;
  
            console.log("Transaction Hash doc:", transactionHash);
  
            // Fetch transaction and receipt details
            const transactionDetails = await provider.eth.getTransaction(transactionHash);
            const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
  
            // Convert timestamp (if needed)
            const timestampInMilliseconds = Number(timestamp) * 1000;
            const readableDate = new Date(timestampInMilliseconds);
  
            // Log human-readable date
            console.log("Readable Date doc:", readableDate.toLocaleString());
  
            // Format the new transaction object
            const newTransaction = {
              type: "Document Uploaded", 
              doctorAddress,
              patientAddress,
              fileLinks,
              transactionHash,
              value: transactionDetails.value, // Amount transferred (if any)
              gasUsed: transactionReceipt.gasUsed, // Gas used
              status: transactionReceipt.status ? "Success" : "Failed", // Transaction status
              timestamp: readableDate.toLocaleString()  // Convert to readable format
            };
  
            console.log("New Transaction:", newTransaction);
  
            // Update transaction state
            setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
          } catch (error) {
            console.error("Error processing the event data:", error);
          }
        });
  
    } catch (error) {
      console.error("Failed to initialize event listener:", error);
    }
  };

  const fetchDocEvent = async () => {
    try {
      console.log("Fetching historical DocumentUploaded events...");
  
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(
        ABI.MEDICAL_RECORDS_MANAGER,
        CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER
      );
  
      // Fetch all "DocumentUploaded" events from the contract
      const events = await contract.getPastEvents("DocumentUploaded", {
        fromBlock: 0,  // Fetch from the first block (adjust if necessary)
        toBlock: "latest"  // Up to the latest block
      });
  
      console.log("Fetched events:", events);
  
      // Loop through events and process them
      for (let event of events) {
        try {
          console.log("Processing event:", event);
  
          const { doctorAddress, patientAddress, fileLinks, timestamp } = event.returnValues;
          const transactionHash = event.transactionHash;
  
          console.log("Transaction Hash:", transactionHash);
  
          // Fetch block details for timestamp
          const blockDetails = await provider.eth.getBlock(event.blockNumber);
          const blockTimestamp = blockDetails.timestamp; // in seconds
  
          // Convert the timestamp to a human-readable format
          const timestampInMilliseconds = Number(blockTimestamp) * 1000;
          const readableDate = new Date(timestampInMilliseconds);
  
          // Fetch additional transaction details
          const transactionDetails = await provider.eth.getTransaction(transactionHash);
          const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);
  
          // Create a new transaction object
          const newTransaction = {
            type: "Document Uploaded",
            doctorAddress,
            patientAddress,
            fileLinks,
            transactionHash,
            value: transactionDetails.value, // Amount transferred (if any)
            gasUsed: transactionReceipt.gasUsed, // Gas used
            status: transactionReceipt.status ? "Success" : "Failed", // Status
            timestamp: readableDate.toLocaleString() // Readable timestamp
          };
  
          console.log("Processed Transaction:", newTransaction);
  
          // Update the transactions state
          setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
        } catch (error) {
          console.error("Error processing individual event:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching historical events:", error);
    }
  };
  
  // Call the function when the component mounts
  useEffect(() => {
    listenForDocuments();
    fetchDocEvent();
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
                        {`Uploaded document by ${transaction.doctorAddress} for ${transaction.patientAddress}`}
                      </TableCell>
                      <TableCell>{transaction.status}</TableCell>
                      <TableCell>{transaction.timestamp}</TableCell>
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
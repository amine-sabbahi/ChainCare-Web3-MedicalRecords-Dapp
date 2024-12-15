"use client";
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Container, Card, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SideBarPatient from '@/components/sideBarPatient';
import { ABI, CONTRACT_ADDRESSES } from '@/components/contracts';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderLoadingState = () => (
    <tr>
      <td colSpan={8} className="text-center py-4">
        <div className="flex justify-center items-center">
          <svg
            className="w-6 h-6 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25"></circle>
            <path className="opacity-75" fill="none" d="M4 12a8 8 0 1 1 16 0A8 8 0 1 1 4 12z"></path>
          </svg>
          <span className="ml-2">Loading...</span>
        </div>
      </td>
    </tr>
  );

  const listenForDocuments = async () => {
    try {
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(
        ABI.DOCUMENT_STORAGE,
        CONTRACT_ADDRESSES.DOCUMENT_STORAGE
      );

      contract.events.DocumentUploaded({ fromBlock: 'latest' })
        .on('data', async (event) => {
          try {
            const { doctorAddress, patientAddress, fileLinks, timestamp } = event.returnValues;
            const transactionHash = event.transactionHash;

            const transactionDetails = await provider.eth.getTransaction(transactionHash);
            const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);

            const timestampInMilliseconds = Number(timestamp) * 1000;
            const readableDate = new Date(timestampInMilliseconds);

            const newTransaction = {
              type: "Document Uploaded",
              doctorAddress,
              patientAddress,
              fileLinks,
              transactionHash,
              value: transactionDetails.value,
              gasUsed: transactionReceipt.gasUsed,
              status: transactionReceipt.status ? "Success" : "Failed",
              timestamp: readableDate.toLocaleString()
            };

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
      const provider = new Web3(window.ethereum);
      const contract = new provider.eth.Contract(
        ABI.MEDICAL_RECORDS_MANAGER,
        CONTRACT_ADDRESSES.MEDICAL_RECORDS_MANAGER
      );

      const events = await contract.getPastEvents("DocumentUploaded", {
        fromBlock: 0,
        toBlock: "latest"
      });

      for (const event of events) {
        try {
          const { doctorAddress, patientAddress, fileLinks,  } = event.returnValues;
          const transactionHash = event.transactionHash;

          const blockDetails = await provider.eth.getBlock(event.blockNumber);
          const blockTimestamp = blockDetails.timestamp;

          const timestampInMilliseconds = Number(blockTimestamp) * 1000;
          const readableDate = new Date(timestampInMilliseconds);

          const transactionDetails = await provider.eth.getTransaction(transactionHash);
          const transactionReceipt = await provider.eth.getTransactionReceipt(transactionHash);

          const newTransaction = {
            type: "Document Uploaded",
            doctorAddress,
            patientAddress,
            fileLinks,
            transactionHash,
            value: transactionDetails.value,
            gasUsed: transactionReceipt.gasUsed,
            status: transactionReceipt.status ? "Success" : "Failed",
            timestamp: readableDate.toLocaleString()
          };

          setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
        } catch (error) {
          console.error("Error processing individual event:", error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching historical events:", error);
    }
  };

  useEffect(() => {
    listenForDocuments();
    fetchDocEvent();
  }, []);

  return (
    <SideBarPatient>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
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
          <Box mt={2} justifyContent="center">
            <TableContainer
              component={Card}
              sx={{
                width: '100%',
                maxHeight: '900px',
                overflow: 'auto',
                border: '1px solid rgba(224, 224, 224, 1)',
              }}
            >
              <Table
                sx={{
                  minWidth: 800,
                  width: '100%'
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
                  {loading ? (
                    renderLoadingState()
                  ) : (
                    transactions.map((transaction, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>
                          {`Uploaded document by ${transaction.doctorAddress} for ${transaction.patientAddress}`}
                        </TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell>{transaction.timestamp}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
    </SideBarPatient>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Container, 
  Typography, 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Stack, 
  CircularProgress,
  Link,
  Tooltip,
  Avatar
} from "@mui/material";
import { 
  Download as DownloadIcon, 
  Person as PersonIcon 
} from '@mui/icons-material';
import SideBarPatient from "@/components/sideBarPatient";

import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [web3Instance, setWeb3Instance] = useState(null);
  const [contract, setContract] = useState(null);

  // Initialize Web3 and contract on client-side only
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contractInstance = new web3.eth.Contract(
        ABI.DOCUMENT_STORAGE, 
        CONTRACT_ADDRESSES.DOCUMENT_STORAGE
      );
      
      setWeb3Instance(web3);
      setContract(contractInstance);
    }
  }, []);

  const fetchDocuments = async () => {
    if (!web3Instance || !contract) {
      setError("Web3 not initialized. Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3Instance.eth.getAccounts();
      const userAddress = accounts[0];

      // Fetch documents for the logged-in patient
      const docs = await contract.methods.getDocuments(userAddress).call();
      
      // Transform document data for display
      const formattedDocs = docs.map((doc) => ({
        doctorAddress: doc.doctorAddress,
        doctorName: doc.doctorName || 'Unknown Doctor',
        patientAddress: doc.patientAddress,
        patientName: doc.patientName || 'Unknown Patient',
        fileLinks: doc.fileLinks || [], 
        timestamp: doc.timestamp 
          ? new Date(Number(doc.timestamp) * 1000).toLocaleString() 
          : 'Unknown timestamp'
      }));

      setDocuments(formattedDocs);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(
        err.message.includes("User denied") 
          ? "Please connect your wallet to view documents." 
          : "Failed to fetch documents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (web3Instance && contract) {
      fetchDocuments();
    }
  }, [web3Instance, contract]);

  const truncateAddress = (address) => {
    return address 
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : 'N/A';
  };

  return (
    <SideBarPatient>
      <Container maxWidth="lg" sx={{ flexGrow: 1, p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 3,
              color: '#2c3e50',
              fontWeight: 600
            }}
          >
            Patient Documents
          </Typography>

          {loading ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress color="primary" />
            </Stack>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : documents.length > 0 ? (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                boxShadow: 'none',
                border: '1px solid rgba(0,0,0,0.12)'
              }}
            >
              <Table>
                <TableHead sx={{ bgcolor: '#f0f3f5' }}>
                  <TableRow>
                    <TableCell>Document ID</TableCell>
                    <TableCell>Doctor Details</TableCell>
                    <TableCell>File Name</TableCell>
                    <TableCell>Download</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        '&:nth-of-type(even)': {
                          backgroundColor: '#f9fafb'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.light',
                              width: 40,
                              height: 40
                            }}
                          >
                            <PersonIcon />
                          </Avatar>
                          <Stack>
                            <Typography variant="caption" color="text.secondary">
                              {truncateAddress(doc.doctorAddress)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {doc.fileLinks.length > 0 ? (
                          doc.fileLinks.map((link, idx) => (
                            <Typography key={idx} variant="body2" color="text.primary">
                              File {idx + 1}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No files available
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {doc.fileLinks.length > 0 ? (
                          doc.fileLinks.map((link, idx) => (
                            <Tooltip key={idx} title="Download File">
                              <Link
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  color: 'primary.main',
                                  mb: 1
                                }}
                              >
                                <DownloadIcon fontSize="small" />
                              </Link>
                            </Tooltip>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {doc.timestamp}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">
              No documents found for this patient.
            </Typography>
          )}
        </Paper>
      </Container>
    </SideBarPatient>
  );
}
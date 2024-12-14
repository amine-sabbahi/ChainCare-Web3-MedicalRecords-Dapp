// lib/ipfs.js
import { create } from 'ipfs-http-client';

// Connect to your IPFS node (running locally on Docker in your case)
const ipfs = create({
  url: 'http://localhost:5001/api/v0',  // Change to your IPFS API URL if different
});

export default ipfs;

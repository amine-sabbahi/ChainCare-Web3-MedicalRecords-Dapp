"use client";

import { useEffect, useState } from "react";
import { FileText, Download, Loader2, AlertCircle } from "lucide-react";
import SideBarDoctor from "@/components/SideBarDoctor";
import ipfs from "../../../lib/ipfs";
import { useAuth } from "@/context/AuthContext";
import Web3 from "web3";
import { ABI, CONTRACT_ADDRESSES } from "@/components/contracts";
import Loading from "@/components/Loading";
import {useRouter} from "next/navigation";

interface DocumentInfo {
  fileLinks: string[];
  timestamp: number;
}

// Loading Component
const DocumentLoading = () => (
  <div className="flex justify-center items-center p-6">
    <div className="flex items-center space-x-2 text-gray-600">
      <Loader2 className="animate-spin" size={24} />
      <span>Loading documents...</span>
    </div>
  </div>
);

const PatientDocumentPage = ({ params }) => {
  const [patientAddress, setPatientAddress] = useState(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<DocumentInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const provider = new Web3(window.ethereum);
  const contract_document = new provider.eth.Contract(
    ABI.DOCUMENT_STORAGE,
    CONTRACT_ADDRESSES.DOCUMENT_STORAGE
  );
  const router = useRouter();

  // Fetch patient address from params
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const resolvedParams = await params;
        setPatientAddress(resolvedParams.address);
      } catch (err) {
        setError("Failed to retrieve patient address");
        console.error(err);
      }
    };

    fetchAddress();
  }, [params]);

  // Fetch patient documents
  const fetchDocuments = async () => {
    if (!patientAddress) return;

    try {
      setIsLoading(true);
      const patientFiles = await contract_document.methods
        .getDocuments(patientAddress)
        .call();

      setUploadedFiles(patientFiles);
      setError(null);
    } catch (error) {
      setError("Error fetching patient documents");
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch documents when patient address changes
  useEffect(() => {
    fetchDocuments();
  }, [patientAddress]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/docx',
        'text/plain'
      ].includes(file.type);

      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (!isValidType) {
        setError(`Invalid file type for ${file.name}`);
      }

      if (!isValidSize) {
        setError(`File ${file.name} exceeds 10MB limit`);
      }

      return isValidType && isValidSize;
    });

    setFiles(validFiles);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    // Reset previous errors
    setError(null);

    // Validate inputs
    if (!files.length) {
      setError("Please select at least one file to upload");
      return;
    }

    if (!user?.address) {
      setError("Doctor's address is not available");
      return;
    }

    if (!patientAddress) {
      setError("Patient address is missing");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedFileLinks = [];

      // Upload files to IPFS
      for (const file of files) {
        const fileData = await ipfs.add(file);
        const fileLink = `http://localhost:8080/ipfs/${fileData.path}`;
        uploadedFileLinks.push(fileLink);
      }

      // Upload to smart contract
      const transaction = await contract_document.methods
        .uploadDocument(patientAddress, uploadedFileLinks)
        .send({ from: user.address });

      // If transaction is successful, re-fetch documents
      if (transaction) {
        await fetchDocuments();
      }

      // Reset state
      setFiles([]);
      setError(null);
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Failed to upload documents. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file download
  const handleDownload = (fileLink: string) => {
    window.open(fileLink, '_blank');
  };


  return (
    <SideBarDoctor>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Documents</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
            <AlertCircle className="mr-3 text-red-500" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* File Upload Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              multiple
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <button
              onClick={handleFileUpload}
              className={`px-4 py-2 rounded-md text-white flex items-center space-x-2 ${
                isUploading || !files.length
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isUploading || !files.length}
            >
              {isUploading && <Loader2 className="animate-spin" size={16} />}
              <span>{isUploading ? 'Uploading...' : 'Upload Documents'}</span>
            </button>
          </div>
          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Selected files: {files.map(file => file.name).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Uploaded Documents Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Uploaded Documents</h2>

          {/* Loading State */}
          {isLoading ? (
            <DocumentLoading />
          ) : uploadedFiles.length === 0 ? (
            <p className="text-gray-500">No documents uploaded yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((document, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Document {index + 1}
                      </p>

                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(document.fileLinks[0])}
                      className="text-green-500 hover:text-green-700"
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SideBarDoctor>
  );
};

export default PatientDocumentPage;
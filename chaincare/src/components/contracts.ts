export const CONTRACT_ADDRESSES = {
    MEDICAL_RECORDS_MANAGER: "0xeFeF25D7AD0689c29c400eD6eC29c57Cb86cB058", 
    PATIENT_REGISTRY: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    DOCTOR_REGISTRY: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    AUDIT_TRAIL: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    MEDICAL_ACCESS_CONTROL: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
};

export const ABI = {
	MEDICAL_RECORDS_MANAGER:[
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "newAdmin",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "adminAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminDetailsUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "removedAdmin",
					"type": "address"
				}
			],
			"name": "AdminRemoved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patient",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctor",
					"type": "address"
				}
			],
			"name": "DoctorAccessGranted",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patient",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctor",
					"type": "address"
				}
			],
			"name": "DoctorAccessRevoked",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctorAddress",
					"type": "address"
				}
			],
			"name": "DoctorRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "bytes32",
					"name": "recordId",
					"type": "bytes32"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "patient",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctor",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "recordType",
					"type": "string"
				}
			],
			"name": "MedicalRecordAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "bytes32",
					"name": "recordId",
					"type": "bytes32"
				}
			],
			"name": "MedicalRecordDeleted",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "bytes32",
					"name": "recordId",
					"type": "bytes32"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "newDescription",
					"type": "string"
				}
			],
			"name": "MedicalRecordUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				}
			],
			"name": "PatientRegistered",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newAdmin",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "addAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patient",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_ipfsHash",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_recordType",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_description",
					"type": "string"
				}
			],
			"name": "addMedicalRecord",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "adminDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "admins",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patient",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "_doctor",
					"type": "address"
				}
			],
			"name": "checkDoctorAccess",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "_recordId",
					"type": "bytes32"
				}
			],
			"name": "deleteMedicalRecord",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "doctorRecords",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "getAdminDetails",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "fullName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "bool",
							"name": "isActive",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct MedicalRecordsAccessControl.AdminDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "_recordId",
					"type": "bytes32"
				}
			],
			"name": "getMedicalRecord",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "patient",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "doctor",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "ipfsHash",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "recordType",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "description",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "timestamp",
							"type": "uint256"
						},
						{
							"internalType": "bool",
							"name": "isActive",
							"type": "bool"
						}
					],
					"internalType": "struct MedicalRecordsManager.MedicalRecord",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_doctor",
					"type": "address"
				}
			],
			"name": "getMedicalRecordsByDoctor",
			"outputs": [
				{
					"internalType": "bytes32[]",
					"name": "",
					"type": "bytes32[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patient",
					"type": "address"
				}
			],
			"name": "getMedicalRecordsByPatient",
			"outputs": [
				{
					"internalType": "bytes32[]",
					"name": "",
					"type": "bytes32[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_doctor",
					"type": "address"
				}
			],
			"name": "getPatientsWithAccess",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_doctor",
					"type": "address"
				}
			],
			"name": "grantDoctorAccess",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isAdmin",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isDoctor",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isPatient",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"name": "medicalRecords",
			"outputs": [
				{
					"internalType": "address",
					"name": "patient",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "doctor",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "ipfsHash",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "recordType",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "timestamp",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "patientDoctorAccess",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "patientRecords",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "primaryAdmin",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredDoctors",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "registeredPatientAddresses",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredPatients",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_admin",
					"type": "address"
				}
			],
			"name": "removeAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_doctor",
					"type": "address"
				}
			],
			"name": "revokeDoctorAccess",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_adminAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "updateAdminDetails",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "bytes32",
					"name": "_recordId",
					"type": "bytes32"
				},
				{
					"internalType": "string",
					"name": "_newIpfsHash",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_description",
					"type": "string"
				}
			],
			"name": "updateMedicalRecord",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	],
    PATIENT_REGISTRY:[
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newAdmin",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "addAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_allergy",
					"type": "string"
				}
			],
			"name": "addAllergy",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_condition",
					"type": "string"
				}
			],
			"name": "addMedicalCondition",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "newAdmin",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "adminAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminDetailsUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "removedAdmin",
					"type": "address"
				}
			],
			"name": "AdminRemoved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctorAddress",
					"type": "address"
				}
			],
			"name": "DoctorRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "PatientProfileUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				}
			],
			"name": "PatientRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "age",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"name": "PatientRegistered",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_age",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_gender",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "registerPatient",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_admin",
					"type": "address"
				}
			],
			"name": "removeAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_adminAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "updateAdminDetails",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_age",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "updatePatientProfile",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "adminDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "admins",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "getAdminDetails",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "fullName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "bool",
							"name": "isActive",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct MedicalRecordsAccessControl.AdminDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllRegisteredPatients",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				}
			],
			"name": "getPatientProfile",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "name",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "age",
							"type": "uint256"
						},
						{
							"internalType": "string",
							"name": "gender",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "string[]",
							"name": "medicalConditions",
							"type": "string[]"
						},
						{
							"internalType": "string[]",
							"name": "allergies",
							"type": "string[]"
						},
						{
							"internalType": "bool",
							"name": "isRegistered",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct PatientRegistry.Patient",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isAdmin",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isDoctor",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isPatient",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "patientProfiles",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "age",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "gender",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isRegistered",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "primaryAdmin",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredDoctors",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "registeredPatientAddresses",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredPatients",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	],
    DOCTOR_REGISTRY: [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newAdmin",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "addAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "newAdmin",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "adminAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminDetailsUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "removedAdmin",
					"type": "address"
				}
			],
			"name": "AdminRemoved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctorAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "DoctorProfileUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctorAddress",
					"type": "address"
				}
			],
			"name": "DoctorRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctorAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "specialization",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"name": "DoctorRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				}
			],
			"name": "PatientRegistered",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_doctorAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_specialization",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				},
				{
					"internalType": "string[]",
					"name": "_qualifications",
					"type": "string[]"
				}
			],
			"name": "registerDoctor",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_admin",
					"type": "address"
				}
			],
			"name": "removeAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_adminAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "updateAdminDetails",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_doctorAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_specialization",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				},
				{
					"internalType": "string[]",
					"name": "_qualifications",
					"type": "string[]"
				}
			],
			"name": "updateDoctorProfile",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "adminDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "admins",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "doctorProfiles",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "specialization",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "getAdminDetails",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "fullName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "bool",
							"name": "isActive",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct MedicalRecordsAccessControl.AdminDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllRegisteredDoctors",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_doctorAddress",
					"type": "address"
				}
			],
			"name": "getDoctorProfile",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "name",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "specialization",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "string[]",
							"name": "qualifications",
							"type": "string[]"
						},
						{
							"internalType": "bool",
							"name": "isActive",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct DoctorRegistry.Doctor",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isAdmin",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isDoctor",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isPatient",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "primaryAdmin",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "registeredDoctorAddresses",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredDoctors",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredPatients",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	],
    AUDIT_TRAIL: [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newAdmin",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "addAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_allergy",
					"type": "string"
				}
			],
			"name": "addAllergy",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_condition",
					"type": "string"
				}
			],
			"name": "addMedicalCondition",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "newAdmin",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "adminAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminDetailsUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "removedAdmin",
					"type": "address"
				}
			],
			"name": "AdminRemoved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctorAddress",
					"type": "address"
				}
			],
			"name": "DoctorRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "PatientProfileUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				}
			],
			"name": "PatientRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "age",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"name": "PatientRegistered",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_age",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_gender",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "registerPatient",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_admin",
					"type": "address"
				}
			],
			"name": "removeAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_adminAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "updateAdminDetails",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_age",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "updatePatientProfile",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "adminDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "admins",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "getAdminDetails",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "fullName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "bool",
							"name": "isActive",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct MedicalRecordsAccessControl.AdminDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllRegisteredPatients",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_patientAddress",
					"type": "address"
				}
			],
			"name": "getPatientProfile",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "name",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "age",
							"type": "uint256"
						},
						{
							"internalType": "string",
							"name": "gender",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "string[]",
							"name": "medicalConditions",
							"type": "string[]"
						},
						{
							"internalType": "string[]",
							"name": "allergies",
							"type": "string[]"
						},
						{
							"internalType": "bool",
							"name": "isRegistered",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct PatientRegistry.Patient",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isAdmin",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isDoctor",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isPatient",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "patientProfiles",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "age",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "gender",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isRegistered",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "primaryAdmin",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredDoctors",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "registeredPatientAddresses",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredPatients",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	],
    MEDICAL_ACCESS_CONTROL: [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newAdmin",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "addAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "newAdmin",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminAdded",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "adminAddress",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "AdminDetailsUpdated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "removedAdmin",
					"type": "address"
				}
			],
			"name": "AdminRemoved",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "doctorAddress",
					"type": "address"
				}
			],
			"name": "DoctorRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "patientAddress",
					"type": "address"
				}
			],
			"name": "PatientRegistered",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_admin",
					"type": "address"
				}
			],
			"name": "removeAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_adminAddress",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_phoneNumber",
					"type": "string"
				}
			],
			"name": "updateAdminDetails",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "adminDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "fullName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "email",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "phoneNumber",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "isActive",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "registrationTimestamp",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "admins",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "getAdminDetails",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "fullName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "email",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "phoneNumber",
							"type": "string"
						},
						{
							"internalType": "bool",
							"name": "isActive",
							"type": "bool"
						},
						{
							"internalType": "uint256",
							"name": "registrationTimestamp",
							"type": "uint256"
						}
					],
					"internalType": "struct MedicalRecordsAccessControl.AdminDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isAdmin",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isDoctor",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isPatient",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "primaryAdmin",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredDoctors",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "registeredPatients",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	],
}
export const CONTRACT_ADDRESSES = {
    MEDICAL_RECORDS_MANAGER: "0xCe4A2940Be7f55041dEBF2473283b141c0872731", // Replace with actual deployed contract address
    PATIENT_REGISTRY: "0x7ED94852da731A53547305B100b6F2bE5a3766ab",
    DOCTOR_REGISTRY: "0x3Ec9745c7Bc93024e4EA3BaC26B89172D92C4c26",
    AUDIT_TRAIL: "0x3Ad438090D6CA3c26f2e4C4c2E7833066B87e709",
    MEDICAL_ACCESS_CONTROL: "0x359EE3fF493898f217d7BBE99C6bFb72627EC569",
};

export const ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_newAdmin",
                type: "address",
            },
        ],
        name: "addAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "newAdmin",
                type: "address",
            },
        ],
        name: "AdminAdded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "removedAdmin",
                type: "address",
            },
        ],
        name: "AdminRemoved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "actor",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "action",
                type: "string",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "recordId",
                type: "bytes32",
            },
        ],
        name: "AuditLogCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "doctorAddress",
                type: "address",
            },
        ],
        name: "DoctorRegistered",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_actor",
                type: "address",
            },
            {
                internalType: "string",
                name: "_action",
                type: "string",
            },
            {
                internalType: "bytes32",
                name: "_recordId",
                type: "bytes32",
            },
        ],
        name: "logAction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "patientAddress",
                type: "address",
            },
        ],
        name: "PatientRegistered",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_admin",
                type: "address",
            },
        ],
        name: "removeAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "admins",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "auditLogs",
        outputs: [
            {
                internalType: "address",
                name: "actor",
                type: "address",
            },
            {
                internalType: "string",
                name: "action",
                type: "string",
            },
            {
                internalType: "bytes32",
                name: "recordId",
                type: "bytes32",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_index",
                type: "uint256",
            },
        ],
        name: "getAuditLogByIndex",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "actor",
                        type: "address",
                    },
                    {
                        internalType: "string",
                        name: "action",
                        type: "string",
                    },
                    {
                        internalType: "bytes32",
                        name: "recordId",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                ],
                internalType: "struct AuditTrail.AuditLog",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAuditLogsCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_count",
                type: "uint256",
            },
        ],
        name: "getLatestAuditLogs",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "actor",
                        type: "address",
                    },
                    {
                        internalType: "string",
                        name: "action",
                        type: "string",
                    },
                    {
                        internalType: "bytes32",
                        name: "recordId",
                        type: "bytes32",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                ],
                internalType: "struct AuditTrail.AuditLog[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_address",
                type: "address",
            },
        ],
        name: "isAdmin",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "primaryAdmin",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "registeredDoctors",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "registeredPatients",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
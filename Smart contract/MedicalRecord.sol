// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Access Control and Management Contract
pragma solidity ^0.8.0;

contract MedicalRecordsAccessControl {
    struct AdminDetails {
        string fullName;
        string email;
        string phoneNumber;
        bool isActive;
        uint registrationTimestamp;
    }

    address public primaryAdmin;
    mapping(address => AdminDetails) public adminDetails;
    mapping(address => bool) public admins;
    mapping(address => bool) public registeredPatients;
    mapping(address => bool) public registeredDoctors;

    // Removed predefined admin addresses
    address[] public allAdmins;

    event AdminAdded(address indexed newAdmin, string name);
    event AdminRemoved(address indexed removedAdmin);
    event AdminDetailsUpdated(address indexed adminAddress, string name);
    event DoctorRegistered(address indexed doctorAddress);
    event PatientRegistered(address indexed patientAddress);

    constructor() {
        // Set the contract deployer as the primary admin
        primaryAdmin = msg.sender;
        admins[msg.sender] = true;
        allAdmins.push(msg.sender);
    }

    modifier onlyPrimaryAdmin() {
        require(msg.sender == primaryAdmin, "Only primary admin can perform this action");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can perform this action");
        _;
    }
    modifier onlyRegisteredDoctor() {
        require(registeredDoctors[msg.sender], "Only registered doctors can perform this action");
        _;
    }

    modifier onlyRegisteredPatient() {
        require(registeredPatients[msg.sender], "Only registered patients can perform this action");
        _;
    }

    function addAdmin(
        address _newAdmin,
        string memory _fullName,
        string memory _email,
        string memory _phoneNumber
    ) external onlyPrimaryAdmin {
        // Gas optimization: Combine multiple checks
        require(!admins[_newAdmin] && _newAdmin != address(0), "Invalid admin address");

        // Directly set admin status
        admins[_newAdmin] = true;

        // Avoid dynamic array resizing by pre-checking and using push
        allAdmins.push(_newAdmin);

        // Use storage efficiently
        adminDetails[_newAdmin] = AdminDetails({
            fullName: _fullName,
            email: _email,
            phoneNumber: _phoneNumber,
            isActive: true,
            registrationTimestamp: block.timestamp
        });

        emit AdminAdded(_newAdmin, _fullName);
    }

    function updateAdminDetails(
        address _adminAddress,
        string memory _fullName,
        string memory _email,
        string memory _phoneNumber
    ) external onlyPrimaryAdmin {
        require(admins[_adminAddress], "Address is not an admin");

        // Directly update storage to minimize gas costs
        AdminDetails storage adminInfo = adminDetails[_adminAddress];
        adminInfo.fullName = _fullName;
        adminInfo.email = _email;
        adminInfo.phoneNumber = _phoneNumber;

        emit AdminDetailsUpdated(_adminAddress, _fullName);
    }

    function removeAdmin(address _admin) external onlyPrimaryAdmin {
        require(_admin != primaryAdmin, "Cannot remove primary admin");
        require(admins[_admin], "Address is not an admin");

        // Efficiently remove admin
        admins[_admin] = false;
        adminDetails[_admin].isActive = false;

        // Remove admin from allAdmins array using efficient method
        for (uint i = 0; i < allAdmins.length; i++) {
            if (allAdmins[i] == _admin) {
                // Replace with last element and pop
                allAdmins[i] = allAdmins[allAdmins.length - 1];
                allAdmins.pop();
                break;
            }
        }

        emit AdminRemoved(_admin);
    }

    // View functions remain mostly the same
    function isAdmin(address _address) external view returns (bool) {
        return admins[_address];
    }

    function getAdminDetails(address _address)
        external
        view
        returns (AdminDetails memory)
    {
        return adminDetails[_address];
    }

    function getAllAdminsDetails() external view returns (address[] memory, AdminDetails[] memory) {
        AdminDetails[] memory allAdminDetails = new AdminDetails[](allAdmins.length);
        for (uint i = 0; i < allAdmins.length; i++) {
            allAdminDetails[i] = adminDetails[allAdmins[i]];
        }
        return (allAdmins, allAdminDetails);
    }

}

// Patient Registry Contract
contract PatientRegistry is MedicalRecordsAccessControl {
    struct Patient {
        string name;
        uint age;
        string gender;
        string email;
        string phoneNumber;
        string[] medicalConditions;
        string[] allergies;
        bool isRegistered;
        uint registrationTimestamp;
    }

    mapping(address => Patient) public patientProfiles;
    address[] public registeredPatientAddresses;

    event PatientRegistered(
        address indexed patientAddress,
        string name,
        uint age,
        uint registrationTimestamp
    );

    event PatientProfileUpdated(
        address indexed patientAddress,
        string name
    );

    function registerPatient(
        address _patientAddress,
        string memory _name,
        uint _age,
        string memory _gender,
        string memory _email,
        string memory _phoneNumber
    ) external onlyAdmin {
        require(!patientProfiles[_patientAddress].isRegistered, "Patient already registered");
        require(_patientAddress != address(0), "Invalid patient address");

        patientProfiles[_patientAddress] = Patient({
            name: _name,
            age: _age,
            gender: _gender,
            email: _email,
            phoneNumber: _phoneNumber,
            medicalConditions: new string[](0),
            allergies: new string[](0),
            isRegistered: true,
            registrationTimestamp: block.timestamp
        });

        registeredPatientAddresses.push(_patientAddress);
        registeredPatients[_patientAddress] = true;

        emit PatientRegistered(_patientAddress, _name, _age, block.timestamp);
    }

    function updatePatientProfile(
        address _patientAddress,
        string memory _name,
        uint _age,
        string memory _email,
        string memory _phoneNumber
    ) external onlyAdmin {
        require(patientProfiles[_patientAddress].isRegistered, "Patient not registered");

        Patient storage patient = patientProfiles[_patientAddress];
        patient.name = _name;
        patient.age = _age;
        patient.email = _email;
        patient.phoneNumber = _phoneNumber;

        emit PatientProfileUpdated(_patientAddress, _name);
    }

    function addMedicalCondition(
        address _patientAddress,
        string memory _condition
    ) external onlyAdmin {
        require(patientProfiles[_patientAddress].isRegistered, "Patient not registered");
        patientProfiles[_patientAddress].medicalConditions.push(_condition);
    }

    function addAllergy(
        address _patientAddress,
        string memory _allergy
    ) external onlyAdmin {
        require(patientProfiles[_patientAddress].isRegistered, "Patient not registered");
        patientProfiles[_patientAddress].allergies.push(_allergy);
    }

    function getPatientProfile(address _patientAddress)
        external
        view
        returns (Patient memory)
    {
        return patientProfiles[_patientAddress];
    }
        event PatientDeleted(
        address indexed patientAddress,
        string name,
        uint deletionTimestamp
    );

    function deletePatient(address _patientAddress) external onlyAdmin {
        require(patientProfiles[_patientAddress].isRegistered, "Patient not registered");

        // Store the patient name for the event before deletion
        string memory patientName = patientProfiles[_patientAddress].name;

        // Remove the patient from the registeredPatientAddresses array
        for (uint i = 0; i < registeredPatientAddresses.length; i++) {
            if (registeredPatientAddresses[i] == _patientAddress) {
                // Replace the address to be deleted with the last address
                registeredPatientAddresses[i] = registeredPatientAddresses[registeredPatientAddresses.length - 1];
                registeredPatientAddresses.pop();
                break;
            }
        }

        // Delete the patient profile
        delete patientProfiles[_patientAddress];
        registeredPatients[_patientAddress] = false;

        emit PatientDeleted(_patientAddress, patientName, block.timestamp);
    }

    function getAllRegisteredPatients()
        external
        view
        returns (address[] memory)
    {
        return registeredPatientAddresses;
    }

    // Function to check if an address is a patient
    function isPatient(address _address) external view returns (bool) {
        return registeredPatients[_address];
    }
}

// Doctor Registry Contract
contract DoctorRegistry is MedicalRecordsAccessControl {
    struct Doctor {
        string name;
        string specialization;
        string email;
        string phoneNumber;
        string[] qualifications;
        bool isActive;
        uint registrationTimestamp;
    }

    mapping(address => Doctor) public doctorProfiles;
    address[] public registeredDoctorAddresses;

    event DoctorRegistered(
        address indexed doctorAddress,
        string name,
        string specialization,
        uint registrationTimestamp
    );

    event DoctorProfileUpdated(
        address indexed doctorAddress,
        string name
    );

    function registerDoctor(
        address _doctorAddress,
        string memory _name,
        string memory _specialization,
        string memory _email,
        string memory _phoneNumber,
        string[] memory _qualifications
    ) external onlyAdmin {
        require(!doctorProfiles[_doctorAddress].isActive, "Doctor already registered");
        require(_doctorAddress != address(0), "Invalid doctor address");

        doctorProfiles[_doctorAddress] = Doctor({
            name: _name,
            specialization: _specialization,
            email: _email,
            phoneNumber: _phoneNumber,
            qualifications: _qualifications,
            isActive: true,
            registrationTimestamp: block.timestamp
        });

        registeredDoctorAddresses.push(_doctorAddress);
        registeredDoctors[_doctorAddress] = true;

        emit DoctorRegistered(
            _doctorAddress,
            _name,
            _specialization,
            block.timestamp
        );
    }

    function updateDoctorProfile(
        address _doctorAddress,
        string memory _name,
        string memory _specialization,
        string memory _email,
        string memory _phoneNumber,
        string[] memory _qualifications
    ) external onlyAdmin {
        require(doctorProfiles[_doctorAddress].isActive, "Doctor not registered");

        Doctor storage doctor = doctorProfiles[_doctorAddress];
        doctor.name = _name;
        doctor.specialization = _specialization;
        doctor.email = _email;
        doctor.phoneNumber = _phoneNumber;
        doctor.qualifications = _qualifications;

        emit DoctorProfileUpdated(_doctorAddress, _name);
    }

    function getDoctorProfile(address _doctorAddress)
        external
        view
        returns (Doctor memory)
    {
        return doctorProfiles[_doctorAddress];
    }
    event DoctorDeleted(
        address indexed doctorAddress,
        string name,
        uint deletionTimestamp
    );

    function deleteDoctor(address _doctorAddress) external onlyAdmin {
        require(doctorProfiles[_doctorAddress].isActive, "Doctor not registered");

        // Store the doctor name for the event before deletion
        string memory doctorName = doctorProfiles[_doctorAddress].name;

        // Remove the doctor from the registeredDoctorAddresses array
        for (uint i = 0; i < registeredDoctorAddresses.length; i++) {
            if (registeredDoctorAddresses[i] == _doctorAddress) {
                // Replace the address to be deleted with the last address
                registeredDoctorAddresses[i] = registeredDoctorAddresses[registeredDoctorAddresses.length - 1];
                registeredDoctorAddresses.pop();
                break;
            }
        }

        // Delete the doctor profile
        delete doctorProfiles[_doctorAddress];
        registeredDoctors[_doctorAddress] = false;

        emit DoctorDeleted(_doctorAddress, doctorName, block.timestamp);
    }

    function getAllRegisteredDoctors()
        external
        view
        returns (address[] memory)
    {
        return registeredDoctorAddresses;
    }

    / Function to check if an address is a doctor
    function isDoctor(address _address) external view returns (bool) {
        return registeredDoctors[_address];
    }

    
}

// Medical Records Management Contract
contract MedicalRecordsManager is MedicalRecordsAccessControl {
    struct MedicalRecord {
        address patient;
        address doctor;
        string ipfsHash;
        string recordType; // diagnosis, prescription, lab result, etc.
        string description;
        uint timestamp;
        bool isActive;
    }
    address[] public registeredPatientAddresses;
    mapping(address => mapping(address => bool)) public patientDoctorAccess;


    mapping(bytes32 => MedicalRecord) public medicalRecords;
    mapping(address => bytes32[]) public patientRecords;
    mapping(address => bytes32[]) public doctorRecords;


    event MedicalRecordAdded(
        bytes32 indexed recordId,
        address indexed patient,
        address indexed doctor,
        string recordType
    );

    event MedicalRecordUpdated(
        bytes32 indexed recordId,
        string newDescription
    );

    event MedicalRecordDeleted(
        bytes32 indexed recordId
    );

    event DoctorAccessGranted(
        address indexed patient,
        address indexed doctor
    );

    event DoctorAccessRevoked(
        address indexed patient,
        address indexed doctor
    );

    function addMedicalRecord(
        address _patient,
        string memory _ipfsHash,
        string memory _recordType,
        string memory _description
    ) external {
        require(
            msg.sender == _patient ||
            patientDoctorAccess[_patient][msg.sender] ||
            registeredDoctors[msg.sender],
            "Unauthorized to add record"
        );

        bytes32 recordId = keccak256(abi.encodePacked(_patient, _ipfsHash, block.timestamp));

        medicalRecords[recordId] = MedicalRecord({
            patient: _patient,
            doctor: msg.sender,
            ipfsHash: _ipfsHash,
            recordType: _recordType,
            description: _description,
            timestamp: block.timestamp,
            isActive: true
        });

        patientRecords[_patient].push(recordId);
        doctorRecords[msg.sender].push(recordId);

        emit MedicalRecordAdded(recordId, _patient, msg.sender, _recordType);
    }

    function updateMedicalRecord(
        bytes32 _recordId,
        string memory _newIpfsHash,
        string memory _description
    ) external {
        MedicalRecord storage record = medicalRecords[_recordId];

        require(
            msg.sender == record.patient ||
            msg.sender == record.doctor,
            "Unauthorized to update record"
        );

        record.ipfsHash = _newIpfsHash;
        record.description = _description;
        record.timestamp = block.timestamp;

        emit MedicalRecordUpdated(_recordId, _description);
    }

    function deleteMedicalRecord(bytes32 _recordId) external {
        MedicalRecord storage record = medicalRecords[_recordId];

        require(
            msg.sender == record.patient ||
            msg.sender == record.doctor,
            "Unauthorized to delete record"
        );

        record.isActive = false;
        emit MedicalRecordDeleted(_recordId);
    }

    function grantDoctorAccess(address _doctor) public {
        patientDoctorAccess[msg.sender][_doctor] = true;
        emit DoctorAccessGranted(msg.sender, _doctor);
    }


    function revokeDoctorAccess(address _doctor) public  {
        patientDoctorAccess[msg.sender][_doctor] = false;
        emit DoctorAccessRevoked(msg.sender, _doctor);
    }

    function getMedicalRecordsByPatient(address _patient)
        external
        view
        returns (bytes32[] memory)
    {
        return patientRecords[_patient];
    }

    function getMedicalRecordsByDoctor(address _doctor)
        external
        view
        returns (bytes32[] memory)
    {
        return doctorRecords[_doctor];
    }

    function getMedicalRecord(bytes32 _recordId)
        external
        view
        returns (MedicalRecord memory)
    {
        return medicalRecords[_recordId];
    }

    function checkDoctorAccess(address _patient, address _doctor)
        external
        view
        returns (bool)
    {
        return patientDoctorAccess[_patient][_doctor];
    }
    // Function for doctors to see which patients have granted them access
    function getPatientsWithAccess(address _doctor) external view returns (address[] memory) {
    address[] memory patientsWithAccess = new address[](registeredPatientAddresses.length);
    uint count = 0;

    for (uint i = 0; i < registeredPatientAddresses.length; i++) {
        address patient = registeredPatientAddresses[i];
        if (patientDoctorAccess[patient][_doctor]) {
            patientsWithAccess[count] = patient;
            count++;
        }
    }


    // Resize the array to return only valid patients
    assembly {
        mstore(patientsWithAccess, count)
    }
    return patientsWithAccess;
    }


}

// Audit Trail Contract
contract AuditTrail is MedicalRecordsAccessControl {
    struct AuditLog {
        address actor;
        string action;
        bytes32 recordId;
        uint timestamp;
    }

    AuditLog[] public auditLogs;

    event AuditLogCreated(
        address indexed actor,
        string action,
        bytes32 indexed recordId
    );

    function logAction(
        address _actor,
        string memory _action,
        bytes32 _recordId
    ) external onlyAdmin {
        AuditLog memory newLog = AuditLog({
            actor: _actor,
            action: _action,
            recordId: _recordId,
            timestamp: block.timestamp
        });

        auditLogs.push(newLog);
        emit AuditLogCreated(_actor, _action, _recordId);
    }

    function getAuditLogsCount() external view returns (uint) {
        return auditLogs.length;
    }

    function getAuditLogByIndex(uint _index)
        external
        view
        returns (AuditLog memory)
    {
        require(_index < auditLogs.length, "Invalid index");
        return auditLogs[_index];
    }

    function getLatestAuditLogs(uint _count)
        external
        view
        returns (AuditLog[] memory)
    {
        uint count = _count > auditLogs.length ? auditLogs.length : _count;
        AuditLog[] memory latestLogs = new AuditLog[](count);

        for (uint i = 0; i < count; i++) {
            latestLogs[i] = auditLogs[auditLogs.length - count + i];
        }

        return latestLogs;
    }
}

contract DocumentStorage {
    struct Document {
        address doctorAddress;
        address patientAddress;
        string[] fileLinks;
        uint256 timestamp; // Added timestamp
    }

    // Mapping of patient address to their documents
    mapping(address => Document[]) public patientDocuments;

    // Event emitted when a document is uploaded
    event DocumentUploaded(
        address indexed doctorAddress,
        address indexed patientAddress,
        string[] fileLinks,
        uint256 timestamp
    );

    // Function to store document data
    function uploadDocument(address patientAddress, string[] memory fileLinks) public {
        require(patientAddress != address(0), "Invalid patient address");

        // Store the document information
        patientDocuments[patientAddress].push(Document({
            doctorAddress: msg.sender,
            patientAddress: patientAddress,
            fileLinks: fileLinks,
            timestamp: block.timestamp // Store the current block's timestamp
        }));

        // Emit an event for document upload
        emit DocumentUploaded(msg.sender, patientAddress, fileLinks, block.timestamp);
    }

    // Function to retrieve documents for a patient
    function getDocuments(address patientAddress) public view returns (Document[] memory) {
        return patientDocuments[patientAddress];
    }
}

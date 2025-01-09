# Healthcare Management System

A comprehensive NextJS application for managing healthcare services, appointments, and patient records.

## Overview

This system connects patients, doctors, and hospitals through a secure platform built with Next.js and Firebase authentication.

## Features

- 🔐 **Authentication**
  - Firebase-based user authentication
  - Secure token management

- 📋 **Patient Services**
  - Medical records management
  - Appointment booking
  - Prescription access
  - Health data tracking

- 🏥 **Hospital Locator**
  - Find nearby hospitals using geolocation
  - View hospital details and contact information
  - Real-time distance calculation
  - Direct call functionality
  - Hospital ratings and reviews

## API Endpoints

### Authentication
- `POST /api/sign-in` - User login
- `POST /api/sign-up-patient` - Patient registration
- `POST /api/auth/verify-token` - Token verification
- `POST /api/auth/set-token` - Set authentication token
- `GET /api/auth/logout` - User logout

### Appointments
- `POST /api/add-appointment` - Create new appointment
- `GET /api/get-appointment` - Retrieve appointments
- `PUT /api/manage-appointment` - Update appointment status

### Medical Records
- `POST /api/add-record` - Add medical record
- `DELETE /api/delete-record` - Remove medical record
- `GET /api/medical-history` - View patient history
- `GET /api/health-data` - Retrieve health metrics

### Prescriptions
- `POST /api/add-prescription` - Create prescription
- `GET /api/get-prescription` - View prescriptions
- `PUT /api/update-prescription` - Modify prescription

### Hospital Management
- `POST /api/add-hospital` - Register new hospital
- `POST /api/add-doctor` - Add doctor to hospital
- `GET /api/doctors` - List available doctors

## API Documentation

### Authentication Endpoints

#### POST /api/sign-in
- **Purpose**: Authenticate existing users
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "role": "patient"
    }
  }
  ```
- **Workflow**:
  1. Validates user credentials
  2. Generates JWT token
  3. Returns user data and token

#### POST /api/sign-up-patient
- **Purpose**: Register new patient
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "patient@example.com",
    "password": "securePassword123",
    "dateOfBirth": "1990-01-01",
    "contactNumber": "+1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "userId": "new_user_id",
    "message": "Patient registered successfully"
  }
  ```
- **Workflow**:
  1. Validates input data
  2. Creates user account
  3. Initializes patient profile
  4. Sends verification email

### Appointment Endpoints

#### POST /api/add-appointment
- **Purpose**: Schedule new appointment
- **Request Body**:
  ```json
  {
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "dateTime": "DateTime",
    "reason": "Reason for appointment",
    "type": "in-person"
  }
  ```
- **Response**:
  ```json
  {
    "appointmentId": "apt_id",
    "status": "pending",
  }
  ```
- **Workflow**:
  1. Checks doctor availability
  2. Validates time slot
  3. Creates appointment

### Medical Records Endpoints

#### POST /api/add-record
- **Purpose**: Add new medical record
- **Request Body**:
  ```json
  {
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "diagnosis": "Fever",
    "prescription": ["Med1", "Med2"],
    "notes": "Patient shows improvement"
  }
  ```
- **Response**:
  ```json
  {
    "recordId": "record_id",
    "timestamp": "2024-02-20T10:30:00Z",
    "status": "created"
  }
  ```
- **Workflow**:
  1. Validates doctor authorization
  2. Processes attachments
  3. Creates record entry
  4. Updates patient history

### Hospital Management Endpoints

#### POST /api/add-hospital
- **Purpose**: Register new hospital
- **Request Body**:
  ```json
  {
    "name": "City Hospital",
    "location": "123 Health St",
    "contactInfo": {
      "phone": "+1234567890",
      "email": "city.hospital@example.com",
        "website": "https://cityhospital.com"
    },
    "services": ["cardiology", "neurology"],
    "bedAvaialbililty": {
        "total": 100,
        "available": 50
    },
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "hospitalId": "hosp_id",
    "status": "active",
  }
  ```
- **Workflow**:
  1. Validates hospital information
  2. Geocodes address
  3. Creates hospital profile
  4. Initiates verification process

## Technology Stack

- **Frontend**: Next.js
- **Authentication**: Firebase Auth
- **API Routes**: Next.js API Routes
- **Styling**: Tailwind CSS
- **Maps Integration**: Google Maps API

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
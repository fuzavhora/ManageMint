# ManageMint API Documentation

## Base URL

## Authentication Routes (`/api/auth`)

### Login User

- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**

````json
{
  "emailOrNumber": "string",
  "password": "string"
}

Response:
```json
{
  "message": "Login successful",
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "number": "string",
    "gender": "string",
    "age": "number"
  }
}

Get User Profile
- **URL:** `/auth/profile`
- **Method:** `GET`
- **Headers:**
  - `Authorization:  <token>`
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "number": "string",
  "gender": "string",
  "age": "number",
  "creditCards": [{
    "bankName": "string",
    "cardNumber": "string",
    "cardType": "string",
    "expiryDate": "string",
    "creditLimit": "number",
    "outstandingAmount": "number"
  }],
  "bankAccounts": [{
    "bankName": "string",
    "accountNumber": "string",
    "balance": "number"
  }]
}

Forgot Password
- **URL:** `/auth/forgot-password`
- **Method:** `POST`
- **Headers:**
  - `Authorization:  <token>`
- **Body:**
```json
{
  "email": "string"
}

Reset Password
- **URL:** `/auth/reset-password`
- **Method:** `POST`
- **Headers:**
  - `Authorization:  <token>`
- **Body:**
```json
{
  "password": "string"
}

Verify Reset OTP
- **URL:** `/auth/verify-reset-otp`
- **Method:** `POST`
- **Body:**
```json
{
  "otp": "string",
  "email": "string"
}

Logout User
- **URL:** `/auth/logout`
- **Method:** `POST`
- **Headers:**
  - `Authorization:  <token>`


##User Routes (`/api/users`)

Register User
- **URL:** `/users/register`
- **Method:** `POST`
- **Body:**
```json
{
  "name": "string",
  "email": "string",
  "number": "string",
  "password": "string",
  "gender": "string",
  "age": "number"
}

Verify OTP
- **URL:** `/users/verify-otp`
- **Method:** `POST`
- **Body:**
```json
{
    "email": "string",
  "otp": "string"
}

Get User Accounts
- **URL:** `/users/accounts`
- **Method:** `GET`
- **Headers:**
  - `Authorization:  <token>`
  

Add Bank Account
- **URL:** `/users/accounts/bank`
- **Method:** `POST`
- **Headers:**
  - `Authorization:  <token>`
- **Body:**
```json
{
  "bankName": "string",
  "accountNumber": "string",
  "balance": "number",
  "ifscCode": "string"
}
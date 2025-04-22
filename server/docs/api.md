# ManageMint API Documentation

## Authentication

## APP MAIN ROUTES
 --user routes
 --admin Routes
 --Auth Routes


 ## Admin Routes
 -  **Admin Login**: `api/admin/login`
   - **Method**: `POST`
 -  **Admin Get Users**: `api/admin/get-users`
   - **Method**: `GET`
 -  **Admin Pending Users**: `api/admin/pending-users`
   - **Method**: `GET`
-  **Admin Approve User**: `api/admin/verify-user/:userId`
   - **Method**: `PUT`
-  **Admin Reject User**: `api/admin/reject-user/:userId`
   - **Method**: `PUT`
-  **Admin Rejected User**: `api/admin/rejected-users`
   - **Method**: `GET`
- **Admin Logout**: `api/admin/logout`
   - **Method**: `POST`

## Auth Routes


## User Routes
- **User Register**: `api/user/register`
   - **Method**: `POST`
- **User verify-otp**: `api/user/verify-otp`
   - **Method**: `POST`
- **User get Accounts**: `api/user/accounts/:id`
   - **Method**: `GET`
- **User Add BankAccounts**: `api/user/bank-accounts`
   - **Method**: `POST`
- **User 



### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "number": "string",
    "password": "string",
    "gender": "string",
    "age": "number"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "OTP sent successfully. Please verify.",
    "tempUser": {
      "name": "string",
      "email": "string",
      "number": "string",
      "otp": "string"
    }
  }
  ```

### Verify OTP
- **URL**: `/api/auth/verify-otp`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "otp": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "OTP verified & user registered successfully"
  }
  ```

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "emailOrNumber": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "number": "string"
    }
  }
  ```

## User Accounts

### Get User Accounts
- **URL**: `/api/user/accounts`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "User account fetched successfully",
    "userAccount": {
      "user": "string",
      "bankBalance": "number",
      "noOfBankAccounts": "number",
      "creditCardOutstanding": "number",
      "noOfCreditCards": "number"
    }
  }
  ```

### Add Bank Account
- **URL**: `/api/user/bank-accounts`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "bankName": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Bank account added successfully",
    "bankAccount": {
      "user": "string",
      "bankName": "string",
      "balance": "number"
    },
    "updatedUserAccount": {
      "user": "string",
      "bankBalance": "number",
      "noOfBankAccounts": "number"
    }
  }
  ```

### Add Credit Card
- **URL**: `/api/user/credit-cards`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "bankName": "string",
    "cardNumber": "string",
    "cardType": "string",
    "expiryDate": "string",
    "cardHolderName": "string",
    "cvv": "string",
    "creditLimit": "number"
  }
  ```
- **Response**:
  ```json
  {
    "creditCard": {
      "user": "string",
      "bankName": "string",
      "cardNumber": "string",
      "cardType": "string",
      "expiryDate": "string",
      "cardHolderName": "string",
      "cvv": "string",
      "creditLimit": "number",
      "outstandingAmount": "number"
    }
  }
  ```

## Transactions

### Add Transaction
- **URL**: `/api/transactions`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "transactionType": "string",
    "amount": "number",
    "category": "string",
    "description": "string",
    "paymentMethod": "string",
    "isBusiness": "boolean",
    "businessType": "string",
    "mobileName": "string",
    "platform": "string",
    "cashback": "number",
    "isSold": "boolean",
    "soldAmount": "number"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Transaction added successfully",
    "transaction": {
      "user": "string",
      "transactionType": "string",
      "amount": "number",
      "category": "string",
      "description": "string",
      "paymentMethod": "string",
      "isBusiness": "boolean",
      "businessType": "string",
      "mobileName": "string",
      "platform": "string",
      "cashback": "number",
      "isSold": "boolean",
      "soldAmount": "number"
    }
  }
  ```

## Error Responses

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "Invalid token. Please log in again!"
}
```

### 403 Forbidden
```json
{
  "status": "fail",
  "message": "Access denied: Admins only"
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Something went very wrong!"
}
``` 
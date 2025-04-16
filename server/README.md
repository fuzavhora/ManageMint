# ManageMint Server

ManageMint is a comprehensive financial management application that helps users track their expenses, manage bank accounts, and monitor credit cards.

## Features

- User Authentication with OTP verification
- Bank Account Management
- Credit Card Management
- Transaction Tracking
- Business Transaction Support
- Mobile Device Management

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- OTP Verification

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OTP_SECRET=your_otp_secret
```

4. Start the server
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - User login

### User Accounts
- `GET /api/user/accounts` - Get user accounts
- `POST /api/user/bank-accounts` - Add bank account
- `POST /api/user/credit-cards` - Add credit card

### Transactions
- `POST /api/transactions` - Add new transaction
- `GET /api/transactions` - Get transaction history

## Project Structure

```
server/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   └── utils/           # Utility functions
├── config/              # Configuration files
└── .env                 # Environment variables
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
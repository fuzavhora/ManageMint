# ManageMint Client

ManageMint is a modern financial management application built with React and Tailwind CSS. It provides a user-friendly interface for managing personal finances, tracking expenses, and monitoring bank accounts and credit cards.

## Features

- Modern, responsive UI with Tailwind CSS
- User Authentication
- Bank Account Management
- Credit Card Tracking
- Transaction History
- Business Transaction Management
- Mobile Device Inventory
- Real-time Updates

## Tech Stack

- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd manage-mint-client
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server
```bash
npm start
```

## Project Structure

```
manage-mint-client/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── context/       # Context providers
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom hooks
│   └── assets/        # Static assets
├── public/            # Public assets
└── tailwind.config.js # Tailwind configuration
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Key Features Implementation

### Authentication
- Secure login and registration
- OTP verification
- Protected routes

### Dashboard
- Overview of financial status
- Quick access to recent transactions
- Account summaries

### Transactions
- Add new transactions
- Filter and search transactions
- Categorize expenses
- Business transaction tracking

### Bank Accounts
- Add and manage bank accounts
- View account balances
- Transaction history

### Credit Cards
- Add and manage credit cards
- Track outstanding amounts
- Monitor credit limits

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Best Practices

- Follow React hooks best practices
- Use proper error handling
- Implement loading states
- Follow accessibility guidelines
- Write clean and maintainable code

## License

This project is licensed under the MIT License.

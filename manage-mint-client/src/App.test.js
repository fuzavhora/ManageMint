import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import App from './App';

const AppWrapper = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<AppWrapper />);
  });

  // Add more test cases
});

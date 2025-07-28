
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from './components/Navigation/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Router>
  );
}

export default App;

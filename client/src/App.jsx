
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from './components/Navigation/Navbar/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
}

export default App;

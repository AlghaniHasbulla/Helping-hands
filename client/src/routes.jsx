import React from 'react'
import SignUp from './components/Auth/SignUp/SignUp';
import SignIn from './components/Auth/SignIn/SignIn';
import DonationRequestForm from './components/Donations/DonationRequestForm';
import NGORequestsHistory from './components/Donations/NGORequestsHistory';
import DonorHome from './components/Donations/DonorHome';
import DonationForm from './components/Donations/DonationForm';
import DonationHistory from './components/Donations/DonationHistory';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';


const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Sign-In" element={<SignIn />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      <Route path="/donation-request" element={<DonationRequestForm />} />
      <Route path="/ngo-requests" element={<NGORequestsHistory />} />
      <Route path="/donor-home" element={<DonorHome />} />
      <Route path="/donate/:id" element={<DonationForm />} />
      <Route path="/donation-history" element={<DonationHistory />} />
    </Routes>
  );
}

export default routes

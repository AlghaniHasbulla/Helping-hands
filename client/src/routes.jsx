import React from 'react';
import SignUp from './components/Auth/SignUp/SignUp';
import SignIn from './components/Auth/SignIn/SignIn';
import { Route, Routes } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
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

export default AppRoutes;
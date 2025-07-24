import React from 'react'
import { useSelector } from 'react-redux';
import SignUp from './components/Auth/SignUp/SignUp';
import SignIn from './components/Auth/SignIn/SignIn';
import DonationRequestForm from './components/Donations/DonationRequestForm';
import NGORequestsHistory from './components/Donations/NGORequestsHistory';
import DonorHome from './components/Donations/DonorHome';
import DonationForm from './components/Donations/DonationForm';
import DonationHistory from './components/Donations/DonationHistory';
import About from './components/About';
import Hero from './components/Hero';
import { Route, Routes, Navigate } from 'react-router-dom';

const DonorReceipts = () => <div>Donor Receipts Page (Placeholder)</div>;
const DonorGoals = () => <div>Donor Goals Page (Placeholder)</div>;

const RoutesWrapper = () => {
  const userRole = useSelector(state => state.auth.user?.role);

  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/Sign-In" element={<SignIn />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      <Route path="/donation-request" element={<DonationRequestForm />} />
      <Route path="/ngo-requests" element={<NGORequestsHistory />} />
      <Route path="/about" element={<About />} />
      {userRole === 'donor' ? (
        <>
          <Route path="/donor/home" element={<DonorHome />} />
          <Route path="/donor/history" element={<DonationHistory />} />
          <Route path="/donor/receipts" element={<DonorReceipts />} />
          <Route path="/donor/goals" element={<DonorGoals />} />
          <Route path="*" element={<Navigate to="/donor/home" replace />} />
        </>
      ) : (
        <>
          <Route path="/donor-home" element={<DonorHome />} />
          <Route path="/donation-history" element={<DonationHistory />} />
          <Route path="*" element={<Navigate to="/Sign-In" replace />} />
        </>
      )}
      <Route path="/donate/:id" element={<DonationForm />} />
    </Routes>
  );
}

export default RoutesWrapper;

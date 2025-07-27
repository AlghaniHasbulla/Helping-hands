import React from 'react'
import { Route, Routes } from 'react-router-dom';
import SignUp from './components/Auth/SignUp/SignUp';
import SignIn from './components/Auth/SignIn/SignIn';
import TokenValidation from './components/Auth/TokenValidation/TokenValidation';
import DonationRequestForm from './components/Donations/DonationRequestForm';
import NGORequestsHistory from './components/Donations/NGORequestsHistory';
import DonorHome from './components/Donations/DonorHome';
import DonationForm from './components/Donations/DonationForm';
import DonationHistory from './components/Donations/DonationHistory';
import Home from './components/Home/Home';
import Causes from './components/Causes/Causes';
import Events from './components/Events/Events';
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import Profile from './components/Profile/Profile';


const routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/causes" element={<Causes />} />
      <Route path="/events" element={<Events />} />
      <Route path="/about" element={<About />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/Sign-In" element={<SignIn />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      <Route path="/donation-request" element={<DonationRequestForm />} />
      <Route path="/ngo-requests" element={<NGORequestsHistory />} />
      <Route path="/donor-home" element={<DonorHome />} />
      <Route path="/donate/:id" element={<DonationForm />} />
      <Route path="/donation-history" element={<DonationHistory />} />
      <Route path="/verify-email" element={<TokenValidation />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default routes

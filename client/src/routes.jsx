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
    </Routes>
  );
}

export default AppRoutes;
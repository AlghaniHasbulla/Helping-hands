import React from 'react'
import SignUp from './components/Auth/SignUp/SignUp';
import SignIn from './components/Auth/SignIn/SignIn';
import { Route, Routes } from 'react-router-dom';
import TokenValidation from './components/Auth/TokenValidation/TokenValidation';


const routes = () => {
  return (
    <Routes>
      <Route path="/Sign-In" element={<SignIn />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      <Route path="/Token" element={<TokenValidation />} />
    </Routes>
  );
}

export default routes
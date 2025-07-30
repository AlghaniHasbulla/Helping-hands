import React from 'react';
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
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/Admin/Layout/AdminLayout';
import AdminDashboard from './components/Admin/Pages/DashboardPage';
import DashboardPage from './components/Admin/Pages/DashboardPage';
import NGOCauses from './components/NGO/NGOCauses';
import CategoryManagerPage from './components/Admin/Pages/CategoryManagerPage';
import RequestQueuePage from './components/Admin/Pages/RequestQueuePage';
import UserManagerPage from './components/Admin/Pages/UserManagerPage';
import ActionLogViewer from './components/Admin/Pages/ActionLogViewer';


const AppRoutes = () => { // It's good practice to give components a capitalized name
  return (
    <Routes>
      {/* --- PUBLIC AND GENERAL USER ROUTES --- */}
      <Route path="/" element={<Home />} />
      <Route path="/causes" element={<Causes />} />
      <Route path="/events" element={<Events />} />
      <Route path="/about" element={<About />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/Sign-In" element={<SignIn />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      <Route path="/verify-email" element={<TokenValidation />} />
      <Route path="/profile" element={<Profile />} />


      
    <Route 
      path="/admin" 
      element={
        <PrivateRoute allowedRoles={['admin', 'superadmin']}>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<AdminDashboard />} /> 
      <Route path="categories" element={<CategoryManagerPage />} />
      <Route path="requests" element={<RequestQueuePage />} />

      <Route 
        path="users" 
        element={
          <PrivateRoute allowedRoles={['superadmin']}>
            <UserManagerPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="logs" 
        element={
          <PrivateRoute allowedRoles={['superadmin']}>
            <ActionLogViewer />
          </PrivateRoute>
        } 
      />
    </Route>

      <Route 
        path="/ngo-dashboard"
        element={
          <PrivateRoute allowedRoles={['ngo']}>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ngo-causes"
        element={
          <PrivateRoute allowedRoles={['ngo']}>
            <NGOCauses />
          </PrivateRoute>
        }
      />


      
      <Route 
        path="/donation-request" 
        element={
          <PrivateRoute allowedRoles={['ngo', 'admin']}>
            <DonationRequestForm />
          </PrivateRoute>
        } 
      />
      
       <Route 
        path="/ngo-requests" 
        element={
          <PrivateRoute allowedRoles={['ngo', 'admin']}>
            <NGORequestsHistory />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/donor-home" 
        element={
          <PrivateRoute allowedRoles={['donor', 'admin']}>
            <DonorHome />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/donate/:id" 
        element={
          <PrivateRoute allowedRoles={['donor', 'admin']}>
            <DonationForm />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/donation-history" 
        element={
          <PrivateRoute allowedRoles={['donor', 'admin']}>
            <DonationHistory />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default AppRoutes; 
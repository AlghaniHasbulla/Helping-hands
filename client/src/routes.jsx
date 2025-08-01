import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from './components/Auth/SignUp/SignUp';
import SignIn from './components/Auth/SignIn/SignIn';
import TokenValidation from './components/Auth/TokenValidation/TokenValidation';
import DonationRequestForm from './components/Donations/DonationRequestForm';
import NGORequestsHistory from './components/Donations/NGORequestsHistory';
import DonorCausesPage from './components/Donations/DonorCausesPage';
import DonationForm from './components/Donations/DonationForm';
import DonationHistory from './components/Donations/DonationHistory';
import Home from './components/Home/Home';
import Causes from './components/Causes/Causes';
import Events from './components/Events/Events';
import EventCreate from './components/Events/EventCreate';
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import Profile from './components/Profile/Profile';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/Admin/Layout/AdminLayout';
// Corrected import: Use DashboardPage consistently
import DashboardPage from './components/Admin/Pages/DashboardPage';
import NGOCauses from './components/NGO/NGOCauses';
// Corrected import: Use CategoryManagementPage
import CategoryManagementPage from './components/Admin/Pages/CategoryManagementPage';
// Corrected import: Use ApproveRequestsPage
import ApproveRequestsPage from './components/Admin/Pages/ApproveRequestsPage';
import UserManagerPage from './components/Admin/Pages/UserManagerPage';
import ActionLogViewer from './components/Admin/Pages/ActionLogViewer';
import AdminCausesPage from './components/Admin/Pages/AdminCausesPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- PUBLIC AND GENERAL USER ROUTES --- */}
      <Route path="/" element={<Home />} />
      <Route path="/causes" element={<Causes />} />
      <Route path="/events" element={<Events />} />
      <Route
        path="/events/create"
        element={
          <PrivateRoute allowedRoles={['ngo', 'admin', 'super_admin']}>
            <EventCreate />
          </PrivateRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/Sign-In" element={<SignIn />} />
      <Route path="/Sign-Up" element={<SignUp />} />
      <Route path="/verify-email" element={<TokenValidation />} />
      <Route path="/profile" element={<Profile />} />


      {/* --- ADMIN ROUTES --- */}
    <Route
      path="/admin"
      element={
        <PrivateRoute allowedRoles={['admin', 'superadmin']}>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<DashboardPage />} /> {/* Using DashboardPage */}
      <Route path="categories" element={<CategoryManagementPage />} /> {/* Using CategoryManagementPage */}
      <Route path="requests" element={<ApproveRequestsPage />} /> {/* Using ApproveRequestsPage */}
      <Route path="causes" element={<AdminCausesPage />} /> {/* New AdminCausesPage */}

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

      {/* --- NGO ROUTES --- */}
      <Route
        path="/ngo-dashboard"
        element={
          <PrivateRoute allowedRoles={['ngo']}>
            {/* Note: DashboardPage is currently designed for Admin.
                If NGO dashboard content differs, you might need a separate NGODashboardPage. */}
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

      {/* --- DONOR ROUTES --- */}
      <Route
        path="/donor-home"
        element={
          <PrivateRoute allowedRoles={['donor', 'admin']}>
            <DonorCausesPage />
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

import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
};

const mainContentStyle = {
  flexGrow: 1,
  padding: '2rem',
  backgroundColor: '#f3f4f6' // var(--background-main)
};

const AdminLayout = () => {
  return (
    <div style={layoutStyle}>
      <AdminSidebar />
      <main style={mainContentStyle}>
        <Outlet />
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AdminLayout;
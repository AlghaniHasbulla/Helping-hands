import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-900">
    
      <AdminSidebar />
      <main className="flex-grow p-8"> 
        <Outlet />
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default AdminLayout;

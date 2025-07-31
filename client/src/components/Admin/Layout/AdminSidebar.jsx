import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css'; 

const AdminSidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <span className="logo-icon"></span> 
        <h2 className="logo-text">Helping Hands</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/requests">Approve Requests</NavLink>
        <NavLink to="/admin/categories">Manage Categories</NavLink>

        {user?.role === 'superadmin' && (
          <>
            <div className="sidebar-separator">SUPERADMIN</div>
            <NavLink to="/admin/users">Manage Users</NavLink>
            <NavLink to="/admin/logs">Action Logs</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
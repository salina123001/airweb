// components/admin/AdminPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  return (
    <div>
      <h1>後台管理</h1>
      <ul>
        <li><Link to="/admin/products">產品管理</Link></li>
        <li><Link to="/admin/members">會員管理</Link></li>
        <li><Link to="/admin/orders">訂單管理</Link></li>
      </ul>
    </div>
  );
};

export default AdminPage;
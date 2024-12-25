// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Sử dụng redux để lấy thông tin người dùng

const PrivateRoute = ({ allowedRoles }) => {
  const { role } = useSelector(state => state.auth); // Giả sử thông tin người dùng đã lưu trong state.auth

  // Kiểm tra vai trò của người dùng
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" />; // Nếu không có quyền, chuyển hướng đến trang login
  }

  return <Outlet />; // Cho phép truy cập vào các route con
};

export default PrivateRoute;

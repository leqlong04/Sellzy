import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = ({ publicPage = false, adminOnly = false }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isLoggedIn = Boolean(user);
  const isAdmin = isLoggedIn && user?.roles?.includes("ROLE_ADMIN");
  const isSeller = isLoggedIn && user?.roles?.includes("ROLE_SELLER");

  if (publicPage) {
    return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (adminOnly) {
    if (isAdmin) {
      return <Outlet />;
    }

    if (isSeller) {
      const sellerAllowedPaths = ["/admin/orders", "/admin/products", "/admin/messages"];
      const sellerAllowed = sellerAllowedPaths.some((path) =>
        location.pathname.startsWith(path)
      );
      return sellerAllowed ? <Outlet /> : <Navigate to="/" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute
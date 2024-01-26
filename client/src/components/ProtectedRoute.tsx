import React from 'react'
import Unauthorized from '../pages/Unauthorized';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Unauthorized/>;
  }
}

export default ProtectedRoute


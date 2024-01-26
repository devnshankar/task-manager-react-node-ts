import React from 'react'
import AlreadyLoggedIn from '../pages/AlreadyLoggedIn';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedLoginSignup({ children }: ProtectedRouteProps) {
  if (localStorage.getItem("token")) {
    return <AlreadyLoggedIn />;
  } else {
    return children;
  }
}

export default ProtectedLoginSignup


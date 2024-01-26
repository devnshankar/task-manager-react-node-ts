import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Header */ }
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Task Manager</h1>
          { (localStorage.getItem("token")) ? (
            <Link to="/dashboard" className="mx-2">
              <button className="bg-white text-blue-500 py-2 px-4 rounded">Go to Dashboard</button>
            </Link>
          ) : (<div>
            <Link to="/login" className="mx-2">
              <button className="bg-white text-blue-500 py-2 px-4 rounded">Login</button>
            </Link>
            <Link to="/register" className="mx-2">
              <button className="bg-white text-blue-500 py-2 px-4 rounded">Register</button>
            </Link>
          </div>)
          }

        </div >
      </header >

      {/* Hero Section */ }
      < section className="bg-blue-500 text-white py-16" >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 animate__animated animate__fadeIn animate__delay-1s">
            Welcome to Task Manager
          </h2>
          <p className="text-lg mb-8 animate__animated animate__fadeIn animate__delay-2s">
            Organize your tasks efficiently and boost your productivity.
          </p>
          { (localStorage.getItem("token")) ? (
            null
          ) : (<div>
            <Link to="/register">
              <button className="bg-white text-blue-500 py-2 px-6 rounded animate__animated animate__fadeIn animate__delay-3s">
                Get Started
              </button>
            </Link>
          </div>)
          }

        </div>
      </section >

      {/* Rest of the content goes here */ }
    </div >
  );
};

export default HomePage;

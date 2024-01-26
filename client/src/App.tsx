import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/theme-provider'
import DashBoard from './pages/DashBoard'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLoginSignup from './components/ProtectedLoginSignup';
import CreateTaskForm from './pages/CreateTaskForm';
import EditTaskPage from './pages/EditTaskPage';


function App() {


  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage />
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedLoginSignup>
                  <LoginPage />
                </ProtectedLoginSignup>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedLoginSignup>
                  <RegisterPage />
                </ProtectedLoginSignup>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/task"
              element={
                <ProtectedRoute>
                  <CreateTaskForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edittask"
              element={
                <ProtectedRoute>
                  <EditTaskPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App

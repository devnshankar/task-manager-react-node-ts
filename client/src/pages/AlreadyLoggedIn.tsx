
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

function AlreadyLoggedIn() {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem('token')
    navigate('/login')
    window.location.reload();
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-2">Unauthorized🚫</h1>
      <h2 className="text-2xl mb-4">User is already logged in please log out to login again or create a new user</h2>
      <Button
        onClick={ handleClick }
        className="px-10 py-6 font-semibold text-2xl"
      >
        Logout now
      </Button>
    </div>

  )
}

export default AlreadyLoggedIn
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/login')
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-2">Unauthorized🚫</h1>
      <h2 className="text-2xl mb-4">Please Login to access this page!!!</h2>
      <Button
        onClick={ handleClick }
        className="px-10 py-6 font-semibold text-2xl"
      >
        Login now
      </Button>
    </div>

  )
}

export default Unauthorized
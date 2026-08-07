
import {useAuth} from './context/AuthContext';



function App() {
   const {user, loading} = useAuth();

  return (
    <>
     <p> hello world </p>
    </>
  )
}

export default App

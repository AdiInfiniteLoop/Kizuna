import { Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'

import { Loader } from 'lucide-react'
function App() {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore()

  useEffect(() => {
    checkAuth()
  },[checkAuth])

  console.log(authUser)

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login'/>} />
        <Route path='/signup' element={!authUser ? <Signup/>: <Navigate to='/login'/> } />
        <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/login'/>} />
        <Route path='/profile' element={authUser ? <Profile/>: <Navigate to='/login'/>} />
        <Route path='/settings' element={<Settings/>} />
      </Routes>
        
    </div>
  )
}

export default App

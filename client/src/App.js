import React,{useEffect,createContext,useReducer,useContext} from 'react'
import NavBar from './components/Navbar'
import Home from './components/Home'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Userprofile from './components/Userprofile'
import Createpost from './components/Createpost'
import Following from './components/Following'
import './App.css'
import { BrowserRouter,Routes,Route,useNavigate } from 'react-router-dom'
import {reducer,initialState} from './reducer/userReducer'

export const UserContext=createContext()

const Routings=()=>{
  const navigate=useNavigate()
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type:'USER',payload:user})
    }      
    else 
      navigate('/signin')
  },[])
  return(
    <>  
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/signin' element={<Signin />}></Route>
          <Route exact path='/signup' element={<Signup />}></Route>
          <Route exact path='/profile' element={<Profile />}></Route>
          <Route exact path='/createpost' element={<Createpost />}></Route>
          <Route exact path='/profile/:id' element={<Userprofile />}></Route>
          <Route exact path='/followings' element={<Following />}></Route>
        </Routes>
    </>
  )     
}

const App=()=>{
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>       
        <NavBar />
        <Routings />   
      </BrowserRouter> 
    </UserContext.Provider>           
  )
}

export default App;

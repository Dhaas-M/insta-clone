import './App.css';
import Navbar from './components/Navbar';
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import AddPost from './components/screens/AddPost';
import React, { useContext, useEffect, useReducer } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { initialState, reducer } from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import FollowersPost from './components/screens/FollowersPost';

export const UserContext = React.createContext()

function Routing(){
  const navigate = useNavigate()
  const {state, dispatch} = useContext(UserContext)
  useEffect( () => {
      const user = JSON.parse(localStorage.getItem('user'))
      //console.log(user);
      if(user) {
        dispatch({type: 'USER', payload: user})
        //navigate('/')
      }
      else navigate('/login')
  }, [])
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signin" element={<Signin />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create" element={<AddPost />} />
        <Route path="profile/:userId" element={<UserProfile />} />
        <Route path="followersPost" element={<FollowersPost />} />
      </Routes>
    )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar/>
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
    </>
  );
}

export default App;

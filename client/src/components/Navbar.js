import React, { useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { UserContext } from '../App'

export default function Navbar() {

  const {state, dispatch} = useContext(UserContext)
  const navigate = useNavigate()
  const renderList = () => {
    if(state) {
      return [
        <li><Link to="profile">Profile</Link></li>,
        <li><Link to="create">Create Post</Link></li>,
        <li><Link to="followersPost">Followings posts</Link></li>,
        <li>
          <button onClick={ () => {
            localStorage.clear()
            dispatch({type:'CLEAR'})
            navigate('/login')
          }}>
            Logout
          </button>
        </li>
      ]
    }
    else {
      return [
        <li><Link to="/signin">SignUp</Link></li>,
        <li><Link to="login">LogIn</Link></li>
      ]
    }
  }
  return (
    <>
    <div>
      <Link to={state ? '/' : '/login'}>Instagram</Link>
      <ul>
        {renderList()}
      </ul>
    </div>
    </>
  )
}

import React from 'react'
import { useState, useContext } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { UserContext } from '../../App'


export default function Login() {
  const {state, dispatch} = useContext(UserContext)
  const navigate = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const handleSubmit = () => {
    //console.log(email);
    fetch('https://instagramclone69.herokuapp.com/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(res => res.json())
    .then(data => {
      if(data.error) return alert(data.error)
      else { 
        localStorage.setItem('jwt',data.token)
        localStorage.setItem('user',JSON.stringify(data.user))
        dispatch({type: 'USER', payload: data.user})
        navigate('/') 
      }
      //console.log(data);
    })
    setEmail('')
    setPassword('')
  }

  return (
    <>
    <h2>Instagram</h2>
    <form action="">
    <input 
        type="text" 
        name="email" 
        id=""
        placeholder="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        name="password" 
        id="" 
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Link to="/signin">Doesn't have an account?</Link>
    </form>
    <button onClick={() => handleSubmit()}>LogIn</button>
    </>
  )
}

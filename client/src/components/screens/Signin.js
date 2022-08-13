import React, { useContext, useState } from 'react'
import {Link,  useNavigate} from 'react-router-dom'

let temp;

export default function Signin() {
  //const host = 'https://instagramclone69.herokuapp.com'
  //const host = 'http://localhost:4000'
  const navigate = useNavigate()
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [image,setImage] = useState(undefined)
  const [url,setUrl] = useState('https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png')

  async function handleImg(data) {
    const res = await fetch('https://api.cloudinary.com/v1_1/diuptzcug/image/upload',{
      method: 'post',
      body: data
    })
    const details = await res.json()
    return details;
  }

  const uploadPic = async () => {
    const data = new FormData()
    data.append("file",image)
    data.append('upload_preset','mern-project')
    data.append('cloud_name','diuptzcug')
    await handleImg(data).then(details => {
      console.log(details);
       temp = details.url
    }) 
  }

  const handleSubmit = async () => {
    if(image) await uploadPic()
     setUrl(temp);
    fetch(`https://instagramclone69.herokuapp.com/signup`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        url: url
      })
    }).then(res => res.json())
    .then(data => {
      if(data.error) return alert(data.error)
      else { 
        alert(data.msg)
        navigate('/login') 
      }
    })
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <>
    <h2>Instagram</h2>
    <form action="">
      <input 
        type="text" 
        name="name" 
        id="" 
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <input 
              type="file" 
              name="post-img" 
              id="" 
              onChange={(e) => setImage(e.target.files[0])}
      />
      <Link to="/login">Already have an account</Link>
    </form>
    <button onClick={() => handleSubmit()}>SignUp</button>
    </>
  )
}

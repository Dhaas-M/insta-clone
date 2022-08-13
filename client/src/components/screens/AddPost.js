import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddPost() {
  const host = 'https://instagramclone69.herokuapp.com'
  //const host = 'http://localhost:4000'
  const navigate = useNavigate()
  const [title,setTitle] = useState('')
  const [body,setBody] = useState('')
  const [image,setImage] = useState('')
  const [url,setUrl] = useState('')

  useEffect(() => {
    if(url) {
        fetch(`${host}/createPost`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          title,
          body,
          pic: url
        })
      }).then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.error) return alert(data.error)
        else { 
          alert(data.msg)
          navigate('/') 
        }
      })
      setTitle('')
      setBody('')
      setUrl('')
    }
  }, [url])

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
      setUrl(details.url)
    }) 
  }
  
  return (
    <>
    <div>
        <form action="">
            <input 
              type="text" 
              name="title" 
              id="" 
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input 
              type="text" 
              name="body" 
              id="" 
              placeholder="Caption"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <input 
              type="file" 
              name="post-img" 
              id="" 
              onChange={(e) => setImage(e.target.files[0])}
            />
        </form>
        <button onClick={() => uploadPic()}>Upload Post</button>
    </div>
    </>
  )
}

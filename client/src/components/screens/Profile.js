import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'

export default function Profile() {

  //const host = 'https://instagramclone69.herokuapp.com'
  //const host = 'http://localhost:4000'
  const {state, dispatch} = useContext(UserContext)
  const [data, setData] = useState([])
  const [image,setImage] = useState('')
  const [url,setUrl] = useState('')

  useEffect( () => {
    fetch(`https://instagramclone69.herokuapp.com/myPosts`, {
      headers: {
        'Authorization': 'Bearer '+localStorage.getItem('jwt')
      }
    }).then(res => res.json())
    .then(posts => {
      console.log(posts);
      setData(posts.myPost)
    }) 
  },[])

   useEffect( () => {
    if(image) {
      const data = new FormData()
      data.append("file",image)
      data.append('upload_preset','mern-project')
      data.append('cloud_name','diuptzcug')

      fetch('https://api.cloudinary.com/v1_1/diuptzcug/image/upload',{
      method: 'post',
      body: data
    }).then(res => res.json())
    .then(data => {
      console.log(data);
      setUrl(data.url)

      fetch(`https://instagramclone69.herokuapp.com/updatePic`,{
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+localStorage.getItem('jwt')
        },
        body: JSON.stringify({
          url: data.url
        })
      }).then(res => res.json())
      .then(result => {
        console.log(result);
        localStorage.setItem('user', JSON.stringify({...state, url: result.url}))
        dispatch({type: 'UPDATE-PIC', payload: result.url})
      })
    })
  }
   }, [image])

  const uploadPic = async (file) => {
    setImage(file)
  }


  return (
    <>
    <h2>profile</h2>
    <div>
      <div className='profile'>
        <h3>{ state && state.name}</h3>
        <img className='profile' src={state ? state.url : '' } alt="" />
      </div>
      <div>
        <input 
                type="file" 
                name="post-img" 
                id="" 
                onChange={(e) => uploadPic(e.target.files[0])}
        />
      </div>
      <div>
        <h3>Posts {data.length}</h3>
        <h3>Followers {state ? state.followers.length : 0}</h3>
        <h3>Following {state ? state.following.length : 0}</h3>
      </div>
    </div>
    <div className="gallery">
      {
        data && data.map(d => {
          return (
            <img key={d._id} src={d.photo} alt={d.title} />
          )
        })
      }
    </div>
    </>
  )
}

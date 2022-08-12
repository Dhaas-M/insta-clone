import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

export default function UserProfile() {

  const {state, dispatch} = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  const { userId } = useParams()
  //console.log(userId);

  useEffect( () => {
    fetch(`https://instagramclone69.herokuapp.com/user/${userId}`, {
      headers: {
        'Authorization': 'Bearer '+localStorage.getItem('jwt')
      }
    }).then(res => res.json())
    .then(result => {
        console.log(result);
      setProfile(result)
    }) 
  },[])

  const follow = () => {
    fetch(`https://instagramclone69.herokuapp.com/follow`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        id: userId
      })
    }).then(res => res.json())
    .then(result => {
      dispatch({ type: 'UPDATE', payload: {followers: result.followers, following: result.following} })
      localStorage.setItem('user', JSON.stringify(result))
      setProfile( (prevState) => {
        return {
            ...prevState,
                user: {
                  ...prevState.user,
                  followers:[...prevState.user.followers,result._id]
                }
        }
      })
    })
  }

  const unfollow = () => {
    fetch(`https://instagramclone69.herokuapp.com/unFollow`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        id: userId
      })
    }).then(res => res.json())
    .then(result => {
      dispatch({ type: 'UPDATE', payload: {followers: result.followers, following: result.following} })
      localStorage.setItem('user', JSON.stringify(result))
      setProfile( (prevState) => {
        const newFollowers = prevState.user.followers.filter(i => i !== result._id)
        return {
            ...prevState,
                user: {
                  ...prevState.user,
                  followers: newFollowers
                }
        }
      })
    })
  }

  return (
    <>
    {
        profile ? 
    <>
       
    <h2>profile</h2>
    <div>
      <div className='profile'>
        <img className='profile' src={''} alt="" />
        <h3>{profile.user.name}</h3>
        <h4>{profile.user.email}</h4>
        {
          profile.user.followers.includes(state._id) ?
          <button onClick={() => unfollow()}>unFollow</button> :
          <button onClick={() => follow()}>Follow</button> 
        }
      </div>
      <div>
        <h3>Posts {profile.posts.length}</h3>
        <h3>Followers {profile.user.followers.length}</h3>
        <h3>Following {profile.user.following.length}</h3>
      </div>
    </div>
    <div className="gallery">
      {
        profile.posts && profile.posts.map(d => {
          return (
            <img key={d._id} src={d.photo} alt={d.title} />
          )
        })
      }
    </div>
    </>
    : <h2>Loading...</h2>
    } 
    </>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

export default function Home() {
  const { state, dispatch } = useContext(UserContext)
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('http://localhost:4000/allPost', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then(res => res.json())
      .then(posts => {
        //console.log(posts.posts);
        setData(posts.posts)
      })
  }, [data])

  const like = (id) => {
    fetch('http://localhost:4000/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')

      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(d => {
          if (d._id === result._id) return result
          else return d
        })
        setData(newData)
      })
  }

  const unLike = (id) => {
    fetch('http://localhost:4000/unLike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(d => {
          if (d._id === result._id) return result
          else return d
        })
        setData(newData)
      })
  }

  const comment = (text, postId) => {
    fetch('http://localhost:4000/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        text,
        postId
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(d => {
          if (d._id === result._id) return result
          else return d
        })
        setData(newData)
      })
  }

  const deleteComment = (id, postId) => {
    fetch(`http://localhost:4000/delete/${postId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        id
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(d => {
          if (d._id === result._id) return result
          else return d
        })
        setData(newData)
      })
  }

  const deletePost = (id) => {
    fetch(`http://localhost:4000/delete/${id}`, {
      method: 'delete',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(d => {
          if (d._id === result._id) return result
          else return d
        })
        setData(newData)
      })
  }

  return (
    <>
      {
        data && data.map(d => {
          return (
            <div key={d._id}>
              <h2><Link to={d.postedBy._id && d.postedBy._id !== state._id ? `/profile/${d.postedBy._id}` : '/profile'}>{d.postedBy.name}</Link></h2>
              {d.postedBy._id === state._id &&
                <button
                  onClick={() => deletePost(d._id)}
                >Delete</button>
              }
              <div>
                <img className='post' src={d.photo} alt="" />
              </div>
              {d.likes.includes(state._id)
                ? <button onClick={() => unLike(d._id)}>❤️</button> :
                <button onClick={() => like(d._id)}>❤️‍🔥</button>
              }
              <div>
                <h6>{d.likes.length}</h6>
                <h6>{d.title}</h6>
                <p>{d.body}</p>
              </div>
              <div>
                {
                  d.comments && d.comments.map(comment => {
                    return (
                      <div>
                        <h3 key={comment._id}>
                          <span>{comment.commentedBy}</span>
                          {comment.text}
                        </h3>
                        {
                          state.name === comment.commentedBy &&
                          <button
                            onClick={() => deleteComment(comment._id, d._id)}
                          >Delete</button>
                        }
                      </div>
                    )
                  })
                }
              </div>
              <div>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  //console.log(e.target[0].value);
                  comment(e.target[0].value, d._id)
                  e.target[0].value = ''
                }}>
                  <input type="text" name="comment" id="" placeholder="Post Your Comments" />
                </form>
              </div>
            </div>
          )
        })
      }
    </>
  )
}

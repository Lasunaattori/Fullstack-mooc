import { useState } from 'react'
const Blog = ({ blog, handleAddLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  // If showdetails is true then display:none, so nothing is rendered, if showdetails false then render it
  const hideWhenVisible = { display: showDetails ? 'none' : '' }
  // if showdetails true then render it
  const showWhenVisible = { display: showDetails ? '' : 'none' }
  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }
  return(
    <div className='blog'>
      <p>{blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={toggleVisibility}> View details </button>
        <button style={showWhenVisible} onClick={toggleVisibility}> Hide details </button>
      </p>
      <p style={showWhenVisible}>{blog.url}</p>
      <p style={showWhenVisible}>{blog.likes} <button onClick={() => handleAddLike({ blog:blog, token:user.token })}>Like</button></p>
      <p style={showWhenVisible}>{blog.user.username}</p>
      {blog.user.username === user.username && <button class="removebutton" style={showWhenVisible} onClick={() => window.confirm(`Delete ${blog.title} by ${blog.author}`) ? handleDelete({ blog:blog, token:user.token }):null}>Remove blog</button>}
    </div>
  )
}

export default Blog